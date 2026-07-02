// 文件：code/ch16/05-utility-types.ts
// 内置工具类型（utility types）入门。它们本身就是泛型。
// 实现原理（映射类型、条件类型）留到第 17 章，这里只学「怎么用」。

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T>：把 T 的所有属性变成可选，常用于「更新时只传一部分字段」。
function updateUser(user: User, patch: Partial<User>): User {
  return { ...user, ...patch };
}
const u0: User = { id: 1, name: "Alice", email: "a@x.com", age: 20 };
const u1 = updateUser(u0, { age: 21 }); // 只更新 age，合法

// Required<T>：把所有属性变成必填（Partial 的反面）。
interface Config {
  host?: string;
  port?: number;
}
const fullConfig: Required<Config> = { host: "localhost", port: 8080 };

// Readonly<T>：把所有属性变成只读。
const frozen: Readonly<User> = u0;
// frozen.age = 99; // 报错：只读属性不能赋值

// Record<K, V>：构造「键为 K、值为 V」的对象类型。
const scores: Record<string, number> = { math: 90, english: 85 };
type Role = "admin" | "guest";
const perms: Record<Role, boolean> = { admin: true, guest: false };

// Pick<T, K>：从 T 中「挑出」若干属性。
type UserPreview = Pick<User, "id" | "name">;
const preview: UserPreview = { id: 1, name: "Alice" };

// Omit<T, K>：从 T 中「去掉」若干属性（Pick 的反面）。
type UserWithoutEmail = Omit<User, "email">;
const noEmail: UserWithoutEmail = { id: 1, name: "Alice", age: 20 };

// ReturnType<F>：取出函数的返回值类型。
function makeUser() {
  return { id: 1, name: "Alice" };
}
type MadeUser = ReturnType<typeof makeUser>; // { id: number; name: string }
const made: MadeUser = { id: 2, name: "Bob" };

console.log("updateUser:", u1);
console.log("Required Config:", fullConfig);
console.log("Readonly:", frozen.name);
console.log("Record:", scores, perms);
console.log("Pick:", preview, "Omit:", noEmail, "ReturnType:", made);

export {};
