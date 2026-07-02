// 文件：code/ch17/02-distributive.ts
// 分布式条件类型（distributive conditional types）

// 当条件类型作用在"裸类型参数"（naked type parameter）上、且传入的是联合类型时，
// 条件类型会对联合的每个成员分别求值，再把结果合并成新的联合。这叫"分发"。

type ToArray<T> = T extends unknown ? T[] : never;

// 传入联合 string | number：
// 分发成 (string extends unknown ? string[] : never) | (number extends unknown ? number[] : never)
// 结果 = string[] | number[]
type A = ToArray<string | number>; // string[] | number[]

// ⚠️ 对比：如果我们用 [T] 把类型参数"包起来"，就阻止分发。
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
type B = ToArrayNonDist<string | number>; // (string | number)[]

// 分发的经典应用：实现 Exclude（从联合里剔除某些成员）
type MyExclude<T, U> = T extends U ? never : T;
// "a" | "b" | "c" 去掉 "a"：
// ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ("c" extends "a" ? never : "c")
// = never | "b" | "c" = "b" | "c"（never 在联合里会被吸收）
type C = MyExclude<"a" | "b" | "c", "a">; // "b" | "c"

// ⚠️ never 的分发陷阱：never 本身是"空联合"，分发时没有任何成员可循环，直接得 never。
type Wrap<T> = T extends unknown ? T[] : never;
type D = Wrap<never>; // never（不是 never[]！因为没有成员参与分发）

// 想让 never 也走一次分支，用 [T] 阻止分发：
type WrapSafe<T> = [T] extends [never] ? "空类型" : "非空";
type E = WrapSafe<never>; // "空类型"
type G = WrapSafe<string>; // "非空"

const proofs: string[] = [
  "ToArray<string|number> = string[] | number[]",
  "ToArrayNonDist<string|number> = (string|number)[]",
  "MyExclude<'a'|'b'|'c','a'> = 'b' | 'c'",
  "Wrap<never> = never（分发陷阱）",
];
for (const p of proofs) console.log("类型检查通过：", p);

export type { A, B, C, D, E, G };
export { MyExclude };
