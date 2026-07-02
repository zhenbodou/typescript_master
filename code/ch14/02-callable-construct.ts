// 文件：code/ch14/02-callable-construct.ts
// 函数类型接口、可调用接口、可构造接口

// 1) 用接口描述"函数类型"
interface BinaryOp {
  (a: number, b: number): number;
}

const add: BinaryOp = (a, b) => a + b;
const mul: BinaryOp = (a, b) => a * b;
console.log("add(2, 3) =", add(2, 3)); // 5
console.log("mul(2, 3) =", mul(2, 3)); // 6

// 2) 可调用接口：既能当函数调用，本身又能带属性
interface Counter {
  (): number; // 可调用签名：直接 counter() 返回当前值
  count: number; // 附加属性
  reset(): void; // 附加方法
}

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

const c = makeCounter();
console.log(c(), c(), c()); // 1 2 3
c.reset();
console.log("重置后：", c()); // 1

// 3) 可构造接口：用 new 签名描述"能被 new 的东西"（构造器类型）
interface PointCtor {
  new (x: number, y: number): { x: number; y: number };
}

function createInstance(Ctor: PointCtor, x: number, y: number) {
  return new Ctor(x, y);
}

class Point {
  constructor(public x: number, public y: number) {}
}

const p = createInstance(Point, 3, 4);
console.log("构造出的点：", p); // Point { x: 3, y: 4 }

export {};
