// 文件：code/ch15/01-func-types.ts
// 函数类型表达式、调用签名、this 参数、构造签名、类型谓词。
// 运行：npx tsx ch15/01-func-types.ts

// ---------- 1) 函数类型表达式 ----------
// (参数: 类型) => 返回类型  —— 描述"一个接收 number 返回 number 的函数"
type NumberMapper = (n: number) => number;

const double: NumberMapper = (n) => n * 2; // n 的类型由 NumberMapper 推出，无需再写
console.log("double(21) =", double(21)); // 42

// 高阶函数：参数本身是函数类型
function mapNumbers(arr: number[], fn: NumberMapper): number[] {
  return arr.map(fn);
}
console.log(mapNumbers([1, 2, 3], double)); // [ 2, 4, 6 ]

// ---------- 2) 调用签名（call signature） ----------
// 函数在 JS 里也是对象，可以挂属性。要同时描述"能被调用"和"带属性"，用调用签名。
type Counter = {
  (): number; // 调用签名：像函数一样被调用，返回 number
  count: number; // 同时它还带一个 count 属性
  reset(): void;
};

function makeCounter(): Counter {
  const fn = (() => {
    fn.count += 1;
    return fn.count;
  }) as Counter;
  fn.count = 0;
  fn.reset = () => {
    fn.count = 0;
  };
  return fn;
}

const tick = makeCounter();
console.log(tick(), tick(), tick()); // 1 2 3
console.log("count =", tick.count); // 3
tick.reset();
console.log("reset 后 count =", tick.count); // 0

// ---------- 3) this 参数类型 ----------
// 第一个名为 this 的"假参数"只用于类型检查，编译后不会成为真实参数。
interface Button {
  label: string;
  onClick(this: Button, times: number): void;
}

const btn: Button = {
  label: "提交",
  onClick(this: Button, times: number) {
    // 这里 this 被标注为 Button，访问 this.label 是类型安全的
    console.log(`按钮「${this.label}」被点了 ${times} 次`);
  },
};
btn.onClick(3); // 按钮「提交」被点了 3 次

// ---------- 4) 构造签名（construct signature） ----------
// new (...) => 实例类型  —— 描述"一个可以被 new 调用的东西"
class Point {
  constructor(public x: number, public y: number) {}
}
type PointCtor = new (x: number, y: number) => Point;

function createInstance(Ctor: PointCtor, x: number, y: number): Point {
  return new Ctor(x, y); // 因为 Ctor 有构造签名，才允许 new
}
const p = createInstance(Point, 3, 4);
console.log("point =", p.x, p.y); // 3 4

// ---------- 5) 类型谓词函数（type predicate）——简介，第 18 章深入 ----------
// 返回类型写成 `参数 is 某类型`，TS 会据此在调用处收窄类型。
function isString(value: unknown): value is string {
  return typeof value === "string";
}

const mixed: unknown[] = ["hi", 42, "world", true];
for (const item of mixed) {
  if (isString(item)) {
    // 在这个分支里，item 被收窄为 string，可以安全调用 .toUpperCase()
    console.log("字符串：", item.toUpperCase());
  }
}

export {};
