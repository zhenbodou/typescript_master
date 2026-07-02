// 文件：code/ch22/string-utils.ts
// 一个小小的字符串工具库。我们用 TDD 的方式：先写测试，再来这里补实现。
// 每个函数都要考虑三类输入：正常输入、边界输入（空串、只有空格）、异常输入。

/**
 * 把字符串首字母大写，其余字母小写。
 * capitalize("hello")  -> "Hello"
 * capitalize("wORLD")  -> "World"
 * capitalize("")       -> ""
 */
export function capitalize(input: string): string {
  if (input.length === 0) return "";
  return input[0].toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * 把任意标题转成 URL 友好的 slug：
 * - 全部小写
 * - 首尾空白去掉
 * - 中间的空白/下划线/非字母数字统一变成单个连字符 "-"
 * slugify("Hello World")      -> "hello-world"
 * slugify("  TS & JS  ")      -> "ts-js"
 * slugify("a---b__c")         -> "a-b-c"
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // 把连续的非字母数字压成一个 "-"
    .replace(/^-+|-+$/g, ""); // 去掉首尾多余的 "-"
}

/**
 * 把字符串截断到指定长度（含省略号在内不超过 maxLength）。
 * 若本身不超长，原样返回。
 * truncate("hello world", 8) -> "hello w…"（7 + 省略号 = 8）
 * truncate("hi", 8)          -> "hi"
 * 约定：ellipsis 默认用单字符省略号 "…"。
 */
export function truncate(
  input: string,
  maxLength: number,
  ellipsis = "…",
): string {
  if (maxLength < 0) {
    throw new RangeError(`maxLength 不能为负数，收到 ${maxLength}`);
  }
  if (input.length <= maxLength) return input;
  // 需要给省略号留位置。若 maxLength 比省略号还短，只能返回被裁剪的省略号。
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);
  return input.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * 统计单词数：按连续空白切分，忽略首尾空白。
 * wordCount("hello world")   -> 2
 * wordCount("  one   two ")  -> 2
 * wordCount("")              -> 0
 * wordCount("   ")           -> 0
 */
export function wordCount(input: string): number {
  const trimmed = input.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * 判断是否为回文（palindrome）：忽略大小写、空格和标点，只看字母数字。
 * isPalindrome("Level")               -> true
 * isPalindrome("A man, a plan, a canal: Panama") -> true
 * isPalindrome("hello")               -> false
 * isPalindrome("")                    -> true（空串视为回文）
 */
export function isPalindrome(input: string): boolean {
  const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, "");
  // 双指针从两端向中间比对
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}
