// 文件：code/ch17/06-rebuild-utility-types.ts
// 亲手重写 TypeScript 内置工具类型，理解它们的原理

// —— 映射类型家族 ——

// Partial：全部变可选
type MyPartial<T> = { [K in keyof T]?: T[K] };

// Required：全部变必填（去掉 ?）
type MyRequired<T> = { [K in keyof T]-?: T[K] };

// Readonly：全部变只读
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Pick：只保留 K 里列出的键（K 受约束必须是 T 的键）
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// Record：以 K 的每个成员为键，值都是 T
type MyRecord<K extends keyof any, T> = { [P in K]: T };

// Omit：删掉 K 列出的键。经典实现 = Pick + Exclude
type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;

// —— 条件类型 / 分发家族 ——

// Exclude：从联合 T 里剔除能赋给 U 的成员
type MyExclude<T, U> = T extends U ? never : T;

// Extract：从联合 T 里保留能赋给 U 的成员
type MyExtract<T, U> = T extends U ? T : never;

// NonNullable：去掉 null 和 undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;
// 也可写成 MyExclude<T, null | undefined>，原理一致。

// —— infer 家族 ——

// ReturnType：提取函数返回值
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never;

// Parameters：提取函数参数元组
type MyParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any ? P : never;

// Awaited（简化版）：递归解开 Promise
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;

// —— 用具体类型验证 ——
interface User {
  id: number;
  name?: string;
  readonly role: "admin" | "user";
}

type _P = MyPartial<User>; // 全可选
type _R = MyRequired<User>; // name 变必填
type _RO = MyReadonly<User>; // 全 readonly
type _Pick = MyPick<User, "id" | "role">; // { id; role }
type _Rec = MyRecord<"a" | "b", number>; // { a: number; b: number }
type _Omit = MyOmit<User, "role">; // { id; name? }
type _Exc = MyExclude<"a" | "b" | "c", "b">; // "a" | "c"
type _Ext = MyExtract<"a" | "b" | "c", "a" | "z">; // "a"
type _NN = MyNonNullable<string | null | undefined>; // string
type _RT = MyReturnType<() => number>; // number
type _PA = MyParameters<(a: string, b: number) => void>; // [a: string, b: number]
type _AW = MyAwaited<Promise<Promise<boolean>>>; // boolean

console.log("类型检查通过：手写内置工具类型全部编译成功");

export type {
  MyPartial,
  MyRequired,
  MyReadonly,
  MyPick,
  MyRecord,
  MyOmit,
  MyExclude,
  MyExtract,
  MyNonNullable,
  MyReturnType,
  MyParameters,
  MyAwaited,
};
