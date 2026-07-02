// 文件：code/ch19/03-all-decorator-kinds.ts
// 演示：标准装饰器的五种"位置"，以及每种位置对应的上下文对象。

// 1) 类装饰器：接收类本身与 ClassDecoratorContext。
//    这里返回一个"子类"来替换原类，给每个实例自动打上创建时间戳。
function stamped<T extends new (...args: any[]) => object>(
  value: T,
  context: ClassDecoratorContext,
) {
  console.log("[类装饰器] 处理类:", context.name);
  return class extends value {
    createdAt = new Date().toISOString();
  };
}

// 2) 字段装饰器：value 恒为 undefined，可返回一个"初始化器"函数，
//    它接收字段的初始值，返回加工后的新值。
function trimmed(_value: undefined, context: ClassFieldDecoratorContext<unknown, string>) {
  return function (initial: string) {
    console.log("[字段装饰器] 初始化", String(context.name));
    return initial.trim();
  };
}

// 3) accessor 装饰器：装饰用 accessor 关键字声明的"自动访问器"。
//    value 是 { get, set }，可返回改写后的 { get, set, init }。
function loggedAccessor<This, V>(
  value: ClassAccessorDecoratorTarget<This, V>,
  context: ClassAccessorDecoratorContext<This, V>,
): ClassAccessorDecoratorResult<This, V> {
  const name = String(context.name);
  return {
    get(this: This) {
      return value.get.call(this);
    },
    set(this: This, newValue: V) {
      console.log(`[accessor 装饰器] 写入 ${name} =`, newValue);
      value.set.call(this, newValue);
    },
  };
}

// 4) getter 装饰器：装饰 get 访问器，target 是 getter 函数本身。
function frozen<This, Return>(
  target: (this: This) => Return,
  context: ClassGetterDecoratorContext<This, Return>,
) {
  return function (this: This): Return {
    const v = target.call(this);
    console.log(`[getter 装饰器] 读取 ${String(context.name)} =`, v);
    return v;
  };
}

@stamped
class Person {
  // ⚠️ 字段装饰器加工的是"字段初始值"，所以这里给一个带空格的初始值。
  //    如果 name 只在构造函数里赋值、没有初始值，@trimmed 的初始化器拿到的会是 undefined。
  @trimmed
  name = "  Alice  ";

  @loggedAccessor
  accessor score = 0;

  @frozen
  get summary(): string {
    return `${this.name}(${this.score})`;
  }
}

const p = new Person();
console.log("name = [" + p.name + "]"); // 已被 trim → [Alice]
p.score = 95; // 触发 accessor 的 set 日志
console.log("summary =", p.summary); // 触发 getter 日志
console.log("createdAt =", (p as any).createdAt); // 由 @stamped 子类注入
