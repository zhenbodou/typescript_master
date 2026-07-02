// 文件：code/ch17/03-infer.ts
// infer 关键字：在条件类型里"声明一个类型变量"来捕获类型

// 语法：在 extends 右侧用 infer X 声明一个占位符，匹配成功后 X 就绑定到对应的类型。

// 1) 提取数组元素类型
type ElementType<T> = T extends Array<infer E> ? E : never;
type E1 = ElementType<number[]>; // number
type E2 = ElementType<string[]>; // string
type E3 = ElementType<Array<{ id: number }>>; // { id: number }
type E4 = ElementType<number>; // never（不是数组）

// 2) 提取函数返回值类型（手写 ReturnType）
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type R1 = MyReturnType<() => string>; // string
type R2 = MyReturnType<(a: number) => boolean>; // boolean
type R3 = MyReturnType<() => void>; // void

// 3) 提取函数第一个参数类型
type FirstArg<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never;
type P1 = FirstArg<(name: string, age: number) => void>; // string

// 4) 提取所有参数类型（元组）
type MyParameters<T> = T extends (...args: infer A) => any ? A : never;
type PA = MyParameters<(a: string, b: number) => void>; // [a: string, b: number]

// 5) Promise 解包（一层）
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
type U1 = UnwrapPromise<Promise<number>>; // number
type U2 = UnwrapPromise<string>; // string（不是 Promise，原样返回）

// 6) 递归解包（多层 Promise），近似标准库 Awaited
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;
type W1 = MyAwaited<Promise<Promise<number>>>; // number
type W2 = MyAwaited<Promise<Promise<Promise<string>>>>; // string

// 7) 一个条件类型里用多个 infer（提取元组的头和尾）
type HeadTail<T> = T extends [infer H, ...infer Rest] ? [H, Rest] : never;
type HT = HeadTail<[1, 2, 3]>; // [1, [2, 3]]

// 运行时演示：用一个真实的 async 函数，配合类型层的 MyAwaited 验证思路
async function fetchCount(): Promise<number> {
  return 42;
}
async function main() {
  const n: MyAwaited<ReturnType<typeof fetchCount>> = await fetchCount();
  console.log("类型检查通过：MyAwaited 解出的类型是 number，值为", n);
}
main();

export type {
  E1,
  E2,
  E3,
  E4,
  R1,
  R2,
  R3,
  P1,
  PA,
  U1,
  U2,
  W1,
  W2,
  HT,
};
export { MyReturnType, MyAwaited };
