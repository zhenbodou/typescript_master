// 文件：code/ch09/str-kit/src/strings.js
// 三个字符串工具函数，全部用命名导出。

/**
 * 把字符串首字母大写，其余保持不变。
 * capitalize("hello") -> "Hello"
 */
export function capitalize(str) {
  if (typeof str !== "string") throw new TypeError("capitalize 需要一个字符串");
  if (str.length === 0) return str;
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * 把一段文字转成 URL 友好的 slug。
 * slugify("Hello World! 你好") -> "hello-world-你好"
 */
export function slugify(str) {
  if (typeof str !== "string") throw new TypeError("slugify 需要一个字符串");
  return str
    .trim()
    .toLowerCase()
    // 把连续的空白字符换成一个连字符
    .replace(/\s+/g, "-")
    // 去掉除字母、数字、连字符、Unicode 文字之外的字符
    .replace(/[^\p{L}\p{N}-]/gu, "")
    // 合并多余的连字符
    .replace(/-+/g, "-")
    // 去掉首尾的连字符
    .replace(/^-|-$/g, "");
}

/**
 * 把过长的字符串截断，并在末尾加上省略号。
 * truncate("abcdefg", 4) -> "abc…"
 */
export function truncate(str, maxLength = 20, ellipsis = "…") {
  if (typeof str !== "string") throw new TypeError("truncate 需要一个字符串");
  if (str.length <= maxLength) return str;
  const keep = Math.max(0, maxLength - ellipsis.length);
  return str.slice(0, keep) + ellipsis;
}
