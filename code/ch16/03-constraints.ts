// 文件：code/ch16/03-constraints.ts
// 泛型约束（constraints）：用 extends 给类型参数「设门槛」。

// 没有约束时，T 可能是任何类型，不能假设它有 .length。
// function longest<T>(a: T, b: T): T {
//   return a.length >= b.length ? a : b; // 报错：T 上不存在 length
// }

// 约束 T 必须有 length: number 这个属性。
interface HasLength {
  length: number;
}
function longest<T extends HasLength>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

const longerStr = longest("hello", "hi"); // string 有 length ✓
const longerArr = longest([1, 2, 3], [9]); // 数组有 length ✓
// longest(10, 20); // 报错：number 没有 length，不满足约束

// keyof 约束：类型安全地按 key 取属性值。
// K 被约束为「T 的所有键之一」，返回类型精确到 T[K]。
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", active: true };
const uid = getProp(user, "id"); // number
const uname = getProp(user, "name"); // string
// getProp(user, "email"); // 报错："email" 不是 user 的键

// 反过来：按 key 安全地写入属性值。
function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}
setProp(user, "name", "Bob"); // ✓ value 必须是 string
// setProp(user, "id", "oops"); // 报错：id 需要 number

console.log("longest string:", longerStr);
console.log("longest array:", longerArr);
console.log("getProp id:", uid, "name:", uname);
console.log("user after setProp:", user);

export {};
