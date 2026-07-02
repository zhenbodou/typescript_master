// 文件：code/ch19/01-decorator-basics.ts
// 演示：最基础的方法装饰器——给方法加上"调用日志"这一横切关注点。

// 方法装饰器接收两个参数：
//   1. target：被装饰的原始方法（一个函数）。
//   2. context：装饰器上下文对象，描述"这是谁、装在哪、叫什么名字"。
// 它可以返回一个"新函数"来替换原方法。
function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const name = String(context.name);

  // 返回的这个新函数将取代原方法被挂到类上。
  function replacement(this: This, ...args: Args): Return {
    console.log(`→ 调用 ${name}(${args.join(", ")})`);
    const result = target.call(this, ...args); // 用 call 保持正确的 this
    console.log(`← ${name} 返回 ${result}`);
    return result;
  }
  return replacement;
}

class Calculator {
  @logged
  add(a: number, b: number): number {
    return a + b;
  }

  @logged
  mul(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
console.log("结果:", calc.add(2, 3));
console.log("结果:", calc.mul(4, 5));
