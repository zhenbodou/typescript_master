// 文件：code/ch19/04-order-and-initializer.ts
// 演示：装饰器的执行顺序，以及上下文的 addInitializer 钩子。

function trace(tag: string) {
  console.log(`① 求值工厂 ${tag}`); // 工厂本身：自上而下先被"调用"
  return function (target: any, context: ClassMethodDecoratorContext | ClassDecoratorContext) {
    console.log(`② 应用装饰器 ${tag}`); // 装饰器应用：由内向外（自下而上）
    return target;
  };
}

@trace("类@外层")
@trace("类@内层")
class Demo {
  @trace("方法@上")
  @trace("方法@下")
  run() {}
}

// addInitializer：在"实例被构造时"运行一段代码，常用于把方法/字段注册到某处。
function autoBind(target: (...args: any[]) => any, context: ClassMethodDecoratorContext) {
  // 把方法绑定到实例，避免 this 丢失。
  context.addInitializer(function (this: any) {
    this[context.name] = target.bind(this);
  });
}

class Button {
  label = "OK";
  @autoBind
  click() {
    console.log("点击了", this.label);
  }
}

console.log("--- 顺序演示结束，开始构造实例 ---");
const b = new Button();
const handler = b.click; // 把方法"拆下来"单独调用
handler(); // 因为 autoBind 已绑定 this，这里仍能拿到 label
