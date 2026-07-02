// 文件：code/ch22/string-utils.test.ts
import { describe, it, expect } from "vitest";
import {
  capitalize,
  slugify,
  truncate,
  wordCount,
  isPalindrome,
} from "./string-utils";

describe("capitalize", () => {
  it("把首字母大写、其余小写", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("wORLD")).toBe("World");
  });

  it("单个字符也能处理", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("空串返回空串（边界）", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("slugify", () => {
  it("空格转连字符并全小写", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("去掉首尾空白与多余连字符", () => {
    expect(slugify("  TS & JS  ")).toBe("ts-js");
  });

  it("连续的分隔符压成一个连字符", () => {
    expect(slugify("a---b__c")).toBe("a-b-c");
  });

  it("纯符号返回空串（边界）", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("truncate", () => {
  it("超长时截断并加省略号（结果总长不超过 maxLength）", () => {
    // "hello world" 超过 8，取前 7 个字符 + 省略号 = 8 个字符
    expect(truncate("hello world", 8)).toBe("hello w…");
    expect(truncate("hello world", 6)).toBe("hello…");
  });

  it("不超长则原样返回（边界）", () => {
    expect(truncate("hi", 8)).toBe("hi");
    expect(truncate("exact", 5)).toBe("exact");
  });

  it("maxLength 极小时只留部分省略号", () => {
    expect(truncate("hello", 0)).toBe("");
    expect(truncate("hello", 1)).toBe("…");
  });

  it("负数 maxLength 抛出 RangeError（异常）", () => {
    expect(() => truncate("hello", -1)).toThrow(RangeError);
  });
});

describe("wordCount", () => {
  it("按空白切分统计单词", () => {
    expect(wordCount("hello world")).toBe(2);
    expect(wordCount("  one   two ")).toBe(2);
  });

  it("空串与纯空白算 0（边界）", () => {
    expect(wordCount("")).toBe(0);
    expect(wordCount("   ")).toBe(0);
  });
});

describe("isPalindrome", () => {
  it("忽略大小写判断回文", () => {
    expect(isPalindrome("Level")).toBe(true);
  });

  it("忽略空格与标点", () => {
    expect(isPalindrome("A man, a plan, a canal: Panama")).toBe(true);
  });

  it("非回文返回 false", () => {
    expect(isPalindrome("hello")).toBe(false);
  });

  it("空串视为回文（边界）", () => {
    expect(isPalindrome("")).toBe(true);
  });
});
