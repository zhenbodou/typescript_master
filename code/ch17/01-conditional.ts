// 文件：code/ch17/01-conditional.ts
// 条件类型（conditional types）入门：T extends U ? X : Y

// 最简单的条件类型：判断 T 是不是 string
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"hello">; // true（字面量 "hello" 也是 string 的子类型）

// 条件类型可以嵌套，像 if / else if / else
type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends undefined
        ? "undefined"
        : T extends Function
          ? "function"
          : "object";

type T1 = TypeName<"abc">; // "string"
type T2 = TypeName<42>; // "number"
type T3 = TypeName<true>; // "boolean"
type T4 = TypeName<() => void>; // "function"
type T5 = TypeName<{ x: number }>; // "object"

// 条件类型和泛型约束的区别：
// 约束是"门槛"（不满足就报错），条件类型是"分支"（不满足就走 else）。
type Flatten<T> = T extends Array<infer Item> ? Item : T;
// 这里先用 infer 提取元素类型，下一节详讲。
type F1 = Flatten<number[]>; // number
type F2 = Flatten<string>; // string（不是数组，原样返回）

// 运行时打印一句话，证明文件能跑（类型层代码在运行时不产生行为）。
// 这里在"类型层"断言结果，运行时只是打印确认信息。
const r1: IsString<string> = true; // 若类型不是 true 则编译报错
const r2: IsString<number> = false; // 若类型不是 false 则编译报错
console.log("类型检查通过：IsString<string> 推导为 true，得到", r1);
console.log("类型检查通过：IsString<number> 推导为 false，得到", r2);

export { IsString, TypeName, Flatten };
export type { A, B, C, T1, T2, T3, T4, T5, F1, F2 };
