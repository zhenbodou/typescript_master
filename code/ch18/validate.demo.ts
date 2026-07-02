// 文件：code/ch18/validate.demo.ts
//
// 演示：用迷你校验库校验「模拟从 API 收到的 JSON」，
// 校验通过后 TS 自动把 unknown 收窄成强类型 User。

import {
  isString,
  isNumber,
  isBoolean,
  isArrayOf,
  isObjectOf,
  optional,
  literalUnion,
  parse,
  assertValid,
  type Infer,
} from "./validate.js";

// ------------------------------------------------------------
// 1) 定义 schema —— 描述我们期望的数据形状
// ------------------------------------------------------------
const userSchema = isObjectOf({
  id: isNumber,
  name: isString,
  active: isBoolean,
  role: literalUnion("admin", "guest"),
  tags: isArrayOf(isString),
  nickname: optional(isString),
});

// 关键：用 Infer 从 schema「反推」出静态类型，无需手写 interface！
type User = Infer<typeof userSchema>;
// User === {
//   id: number; name: string; active: boolean;
//   role: "admin" | "guest"; tags: string[]; nickname: string | undefined;
// }

// ------------------------------------------------------------
// 2) 合法输入：模拟一段来自网络、类型未知的数据
// ------------------------------------------------------------
const rawGood: unknown = JSON.parse(
  '{"id":1,"name":"Alice","active":true,"role":"admin","tags":["x","y"]}'
);

const user: User = parse(userSchema, rawGood);
// 从这里开始，user 是完全强类型的：
console.log("✅ 校验通过:");
console.log("  name:", user.name.toUpperCase()); // string 方法安全
console.log("  role:", user.role); // "admin" | "guest"
console.log("  tags:", user.tags.join(", ")); // string[]
console.log("  nickname:", user.nickname ?? "(无)"); // string | undefined

// ------------------------------------------------------------
// 3) assertValid：断言函数用法，收窄一个 unknown 变量
// ------------------------------------------------------------
const rawUnknown: unknown = rawGood;
assertValid(userSchema, rawUnknown);
// 这一行之后，rawUnknown 被收窄为 User（不是 unknown 了）
console.log("  断言后可直接访问:", rawUnknown.name);

// ------------------------------------------------------------
// 4) 非法输入：展示清晰的错误路径
// ------------------------------------------------------------
const rawBad: unknown = {
  id: "not-a-number", // 类型错
  name: "Bob",
  active: "yes", // 应为 boolean
  role: "superuser", // 不在字面量联合内
  tags: ["ok", 42, "fine"], // tags[1] 类型错
};

try {
  parse(userSchema, rawBad);
} catch (e) {
  console.log("\n❌ 校验失败，错误路径清晰:");
  console.log((e as Error).message);
}
