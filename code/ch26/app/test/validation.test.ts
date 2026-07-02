// 文件：code/ch26/app/test/validation.test.ts
// 校验函数的单元测试：边界输入应被拒绝、合法输入应被规范化（trim）。

import { describe, it, expect } from "vitest";
import { parseCreateTask, parseUpdateTask } from "../src/domain/validation.js";
import { ValidationError } from "../src/domain/errors.js";

describe("parseCreateTask", () => {
  it("接受合法输入并 trim 掉首尾空格", () => {
    expect(parseCreateTask({ title: "  买菜  " })).toEqual({
      title: "买菜",
      done: undefined,
    });
  });

  it("拒绝空标题", () => {
    expect(() => parseCreateTask({ title: "   " })).toThrow(ValidationError);
  });

  it("拒绝非对象请求体", () => {
    expect(() => parseCreateTask("not an object")).toThrow(ValidationError);
    expect(() => parseCreateTask(null)).toThrow(ValidationError);
  });

  it("拒绝错误类型的 done", () => {
    expect(() => parseCreateTask({ title: "x", done: "yes" })).toThrow(ValidationError);
  });
});

describe("parseUpdateTask", () => {
  it("允许只传一个字段", () => {
    expect(parseUpdateTask({ done: true })).toEqual({ done: true });
  });

  it("拒绝空 patch（一个字段都不传）", () => {
    expect(() => parseUpdateTask({})).toThrow(ValidationError);
  });
});
