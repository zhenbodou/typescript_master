// 文件：code/ch17/04-mapped.ts
// 映射类型（mapped types）：遍历一个类型的所有键，逐个改造

interface User {
  id: number;
  name: string;
  email: string;
}

// 基本形式：{ [K in keyof T]: T[K] } —— 这是"原样复制"，等价于 T
type Identity<T> = { [K in keyof T]: T[K] };
type SameAsUser = Identity<User>; // { id: number; name: string; email: string }

// 手写 Partial：给每个属性加上 ?（可选修饰符）
type MyPartial<T> = { [K in keyof T]?: T[K] };
type PU = MyPartial<User>; // { id?: number; name?: string; email?: string }

// 手写 Readonly：给每个属性加上 readonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type RU = MyReadonly<User>; // { readonly id: number; ... }

// 修饰符可以"加"也可以"减"：+ 是加（默认可省略），- 是减。
// 手写 Required：用 -? 去掉可选
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MaybeUser = { id?: number; name?: string };
type RequiredUser = MyRequired<MaybeUser>; // { id: number; name: string }

// 去掉 readonly：用 -readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type MutableUser = Mutable<MyReadonly<User>>; // { id: number; name: string; email: string }

// key remapping（键重映射）：用 as 改造键名。配合模板字面量类型可批量改名。
// 生成 getter 名字：id -> getId，name -> getName
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail: () => string }

// key remapping 还能"过滤"键：把某个键映射成 never 即可删除它。
// 手写 Omit：删掉键 K
type MyOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
type WithoutEmail = MyOmit<User, "email">; // { id: number; name: string }

// 运行时演示：真的做出一个 getters 对象，类型与 UserGetters 对齐
const user: User = { id: 1, name: "Ada", email: "ada@x.io" };
const getters: UserGetters = {
  getId: () => user.id,
  getName: () => user.name,
  getEmail: () => user.email,
};
console.log("类型检查通过：getName() =", getters.getName());

export type {
  SameAsUser,
  PU,
  RU,
  RequiredUser,
  MutableUser,
  UserGetters,
  WithoutEmail,
};
export { };
