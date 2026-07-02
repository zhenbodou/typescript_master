// 文件：code/ch15/04-abstract-implements.ts
// 抽象类 abstract、类实现接口 implements、# 私有 vs private、类作为类型 vs 值。
// 运行：npx tsx ch15/04-abstract-implements.ts

// ---------- 1) 接口 + implements ----------
// 接口只描述"形状"，implements 让类承诺"我满足这个形状"。
interface Shape {
  readonly name: string;
  area(): number;
}

// ---------- 2) 抽象类 abstract ----------
// abstract 类不能被 new，只能被继承。它可以提供公共实现，也可以留下 abstract 成员让子类实现。
abstract class BaseShape implements Shape {
  abstract readonly name: string; // 抽象字段：子类必须提供
  abstract area(): number; // 抽象方法：只有签名，子类必须实现

  // 非抽象方法：所有子类共享的公共逻辑
  describe(): string {
    return `${this.name} 的面积是 ${this.area().toFixed(2)}`;
  }
}

class Circle extends BaseShape {
  readonly name = "圆";
  constructor(private radius: number) {
    super(); // 子类构造函数必须先调 super()
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends BaseShape {
  readonly name = "矩形";
  constructor(private w: number, private h: number) {
    super();
  }
  area(): number {
    return this.w * this.h;
  }
}

// const s = new BaseShape(); // ⚠️ 报错：不能创建抽象类的实例

// ---------- 3) 类作为"类型" vs 作为"值" ----------
// 声明一个类，同时产生：一个"值"（构造函数，可 new）和一个"类型"（实例类型）。
// 用 BaseShape 作类型（它带公共方法 describe）；抽象类不能被 new，但能当类型用。
const shapes: BaseShape[] = [new Circle(2), new Rectangle(3, 4)];
for (const shape of shapes) {
  console.log(shape.describe());
}
// 圆 的面积是 12.57
// 矩形 的面积是 12.00

const CircleCtor = Circle; // Circle 用作【值】——把构造函数赋给变量
const c2 = new CircleCtor(1);
console.log(c2.area().toFixed(2)); // 3.14

// ---------- 4) # 私有字段 vs private ----------
class Secret {
  #realKey = "hard-#-private"; // # 是 JS 运行时真正的私有，外部无法用任何手段读取
  private softKey = "soft-private"; // private 只是 TS 编译期检查，编译成 JS 后其实还在

  reveal(): string {
    return `${this.#realKey} / ${this.softKey}`;
  }
}

const sec = new Secret();
console.log(sec.reveal());
// console.log(sec.#realKey);       // ⚠️ 语法错误：# 私有在类外不可见
// console.log((sec as any).softKey);  // 运行时能读到！private 只是"君子协定"
console.log("绕过 TS 读 private：", (sec as any).softKey); // soft-private —— 证明它运行时还在
console.log("# 私有的属性名：", Object.keys(sec)); // 只有 softKey，看不到 #realKey

export {};
