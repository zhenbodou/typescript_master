// 文件：code/ch19/02-decorator-factory.ts
// 演示：装饰器工厂（decorator factory）——带参数的装饰器。
// 装饰器工厂本身是一个"返回装饰器的函数"，你先调用它传参，它再吐出真正的装饰器。

// @measure() 用于给方法计时；参数 label 用来自定义日志前缀。
function measure(label?: string) {
  // 外层函数接收"配置参数"，返回真正的装饰器。
  return function <This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext,
  ) {
    const name = label ?? String(context.name);
    return function (this: This, ...args: Args): Return {
      const start = performance.now();
      const result = target.call(this, ...args);
      const cost = (performance.now() - start).toFixed(3);
      console.log(`⏱ ${name} 耗时 ${cost}ms`);
      return result;
    };
  };
}

// @cached() 缓存"无参或参数可序列化"的方法结果，避免重复计算。
function cached() {
  return function <This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext,
  ) {
    const store = new Map<string, Return>();
    return function (this: This, ...args: Args): Return {
      const key = JSON.stringify(args);
      if (store.has(key)) {
        console.log("✔ 命中缓存", key);
        return store.get(key)!;
      }
      const result = target.call(this, ...args);
      store.set(key, result);
      return result;
    };
  };
}

class Report {
  // @measure 计时；@cached 缓存结果。两个装饰器叠加，由内向外生效。
  @measure("统计求和")
  @cached()
  sumTo(n: number): number {
    let total = 0;
    for (let i = 1; i <= n; i++) total += i;
    return total;
  }
}

const r = new Report();
console.log("sumTo(1000000) =", r.sumTo(1_000_000));
console.log("sumTo(1000000) =", r.sumTo(1_000_000)); // 第二次直接命中缓存
