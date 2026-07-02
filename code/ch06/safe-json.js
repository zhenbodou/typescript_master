// 文件：code/ch06/safe-json.js
// 运行方式：node safe-json.js
// 本章小项目：健壮的 JSON 解析器
// - safeParseJSON(text, options) 永不抛错，统一返回 { ok, value } / { ok, error }
// - 支持 defaultValue 兜底
// - 支持简单 schema 校验：requiredFields，缺字段抛自定义 ValidationError
// ESM 导出，供测试与演示复用。

// ── 自定义错误类 ──────────────────────────────────────────────
export class ValidationError extends Error {
  constructor(message, missingFields = []) {
    super(message);
    this.name = "ValidationError";
    this.missingFields = missingFields; // 结构化信息：到底缺了哪些字段
  }
}

// ── 核心函数 ─────────────────────────────────────────────────
/**
 * 安全地解析 JSON。永远不抛错，把结果打包成统一结构。
 * @param {string} text        待解析的 JSON 字符串
 * @param {object} [options]
 * @param {*}      [options.defaultValue]     解析失败时返回的兜底值
 * @param {string[]} [options.requiredFields] 解析结果（对象）必须包含的字段
 * @returns {{ok: true, value: any} | {ok: false, error: Error, value?: any}}
 */
export function safeParseJSON(text, options = {}) {
  const { defaultValue, requiredFields } = options;

  // 防御性校验：连字符串都不是，直接判失败
  if (typeof text !== "string") {
    const error = new TypeError(`期望字符串，收到 ${typeof text}`);
    return finalizeError(error, defaultValue);
  }

  let value;
  try {
    value = JSON.parse(text); // 可能抛 SyntaxError
  } catch (e) {
    // 把底层 SyntaxError 包装进 cause，方便追踪
    const error = new SyntaxError(`JSON 解析失败：${e.message}`, { cause: e });
    return finalizeError(error, defaultValue);
  }

  // schema 校验：要求结果是对象且包含全部必需字段
  if (requiredFields && requiredFields.length > 0) {
    const missing = validateFields(value, requiredFields);
    if (missing.length > 0) {
      const error = new ValidationError(
        `缺少必需字段：${missing.join(", ")}`,
        missing
      );
      return finalizeError(error, defaultValue);
    }
  }

  return { ok: true, value };
}

// ── 辅助函数 ─────────────────────────────────────────────────
// 统一构造“失败结果”。有 defaultValue 就带上，方便调用方直接取用。
function finalizeError(error, defaultValue) {
  const result = { ok: false, error };
  if (defaultValue !== undefined) {
    result.value = defaultValue;
  }
  return result;
}

// 返回“缺失字段”数组；若不是对象，视为所有字段都缺
function validateFields(value, requiredFields) {
  const isPlainObject =
    value !== null && typeof value === "object" && !Array.isArray(value);
  if (!isPlainObject) {
    return [...requiredFields]; // 根本不是对象，全部算缺
  }
  return requiredFields.filter((field) => !(field in value));
}

// ── 演示区（直接运行本文件时执行）───────────────────────────
function demo() {
  const line = "─".repeat(50);

  // 1) 合法 JSON
  console.log(line);
  console.log("① 合法 JSON：");
  console.log(safeParseJSON('{"name":"小明","age":20}'));

  // 2) 非法 JSON
  console.log(line);
  console.log("② 非法 JSON：");
  const bad = safeParseJSON("{ 这不是 JSON }");
  console.log("  ok    =", bad.ok);
  console.log("  error =", bad.error.name, "->", bad.error.message);
  console.log("  cause =", bad.error.cause?.name);

  // 3) 非法 JSON + 默认值兜底
  console.log(line);
  console.log("③ 非法 JSON + defaultValue：");
  console.log(safeParseJSON("坏数据", { defaultValue: { name: "游客" } }));

  // 4) 合法 JSON 但缺字段（schema 校验失败）
  console.log(line);
  console.log("④ 缺字段（要求 name & email）：");
  const missing = safeParseJSON('{"name":"小红"}', {
    requiredFields: ["name", "email"],
  });
  console.log("  ok            =", missing.ok);
  console.log("  error         =", missing.error.name);
  console.log("  missingFields =", missing.error.missingFields);

  // 5) 字段齐全，校验通过
  console.log(line);
  console.log("⑤ 字段齐全：");
  console.log(
    safeParseJSON('{"name":"小刚","email":"a@b.com"}', {
      requiredFields: ["name", "email"],
    })
  );

  // 6) 传入的根本不是字符串
  console.log(line);
  console.log("⑥ 非字符串输入：");
  const notStr = safeParseJSON(null);
  console.log("  ok    =", notStr.ok);
  console.log("  error =", notStr.error.name, "->", notStr.error.message);

  // 7) 典型用法：一行搞定“解析 + 兜底”
  console.log(line);
  console.log("⑦ 实战用法：");
  const { ok, value, error } = safeParseJSON(process.env.CONFIG ?? "{}", {
    defaultValue: {},
  });
  if (ok) console.log("  配置读取成功：", value);
  else console.log("  配置读取失败，已用默认值：", value, "/", error.message);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  demo();
}
