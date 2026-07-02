// 文件：code/ch06/demo.js
// 运行方式：node demo.js
// 主题：把小项目 safeParseJSON 当作模块 import 进来使用（ESM 复用演示）

import { safeParseJSON, ValidationError } from "./safe-json.js";

const inputs = [
  '{"name":"小明","email":"m@x.com"}', // 合法且齐全
  '{"name":"小红"}', // 缺 email
  "not json", // 非法
];

for (const raw of inputs) {
  const result = safeParseJSON(raw, {
    requiredFields: ["name", "email"],
    defaultValue: { name: "游客", email: "guest@x.com" },
  });

  if (result.ok) {
    console.log("✅ 解析成功：", result.value);
  } else if (result.error instanceof ValidationError) {
    console.log(
      "⚠️ 校验失败，缺字段：",
      result.error.missingFields,
      "→ 用默认值：",
      result.value
    );
  } else {
    console.log("❌ 解析失败：", result.error.message, "→ 用默认值：", result.value);
  }
}
