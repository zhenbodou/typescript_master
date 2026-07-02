// 文件：code/ch06/06-defensive.js
// 运行方式：node 06-defensive.js
// 主题：防御性编程 —— 参数校验、早返回（guard clause）、断言（assert）

import assert from "node:assert/strict";

// 1) 参数校验 + 早返回（guard clause）
// 反例：层层嵌套的 if，读起来像金字塔
function createUserBad(user) {
  if (user) {
    if (user.name) {
      if (typeof user.age === "number") {
        return `创建成功：${user.name}, ${user.age} 岁`;
      } else {
        throw new TypeError("age 必须是数字");
      }
    } else {
      throw new TypeError("缺少 name");
    }
  } else {
    throw new TypeError("user 不能为空");
  }
}

// 正例：把“不满足条件”的情况尽早挡掉，主流程保持在最左侧
function createUser(user) {
  if (!user) throw new TypeError("user 不能为空");
  if (!user.name) throw new TypeError("缺少 name");
  if (typeof user.age !== "number") throw new TypeError("age 必须是数字");

  // 走到这里，说明所有前置条件都满足，逻辑清爽
  return `创建成功：${user.name}, ${user.age} 岁`;
}

console.log(createUser({ name: "小明", age: 20 }));
try {
  createUser({ name: "小红" });
} catch (e) {
  console.log("挡下非法输入：", e.name, "->", e.message);
}
console.log("（Bad 版本结果一致，但可读性差）", createUserBad({ name: "小李", age: 30 }));

// 2) 断言（assert）：表达“我确信此处必然为真”，否则立刻炸
function divide(a, b) {
  assert(typeof a === "number", "a 必须是数字");
  assert(b !== 0, "除数不能为 0");
  return a / b;
}
console.log("\n10 / 2 =", divide(10, 2));
try {
  divide(10, 0);
} catch (e) {
  console.log("断言失败：", e.message);
}

// 3) 自己写个轻量断言（不依赖库时很常用）
function invariant(condition, message) {
  if (!condition) {
    throw new Error("Invariant 违反：" + message);
  }
}
try {
  const list = [];
  invariant(list.length > 0, "列表不应为空");
} catch (e) {
  console.log("\n", e.message);
}
