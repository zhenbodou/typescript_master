// 文件：code/ch16/02-generic-func.ts
// 泛型函数：类型推断 vs 显式指定；多个类型参数；泛型与元组。

// 最经典的泛型函数：identity（恒等函数），原样返回传入的值。
function identity<T>(x: T): T {
  return x;
}

// 1) 类型推断（inference）：不写 <...>，TS 从实参推断 T。
const r1 = identity(42); // T = number，r1: number
const r2 = identity("hi"); // T = string，r2: string
const r3 = identity(true); // T = boolean，r3: boolean

// 2) 显式指定（explicit）：手动写 <...>，覆盖推断结果。
const r4 = identity<string>("abc"); // 明确 T = string
// const r5 = identity<number>("abc"); // 报错：字符串不能赋给 number

// 多个类型参数：pair 把两个值组成一个元组。
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair("age", 30); // p: [string, number]

// swap：交换元组的两个元素，返回类型也随之交换。
function swap<A, B>(t: [A, B]): [B, A] {
  return [t[1], t[0]];
}
const sw = swap(p); // sw: [number, string]

// 类型参数之间可以互相引用：把数组每一项做映射。
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of arr) {
    result.push(fn(item));
  }
  return result;
}
const lengths = mapArray(["a", "bb", "ccc"], (s) => s.length); // number[]

console.log("identity:", r1, r2, r3, r4);
console.log("pair:", p);
console.log("swap:", sw);
console.log("mapArray lengths:", lengths);

export {};
