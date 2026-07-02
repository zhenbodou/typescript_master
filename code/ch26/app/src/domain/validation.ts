// 文件：code/ch26/app/src/domain/validation.ts
// 请求校验（第 18 章「类型守卫 + 显式检查」的思想落到 HTTP 边界）：
// 外部传进来的东西一律当作 unknown，校验通过后才「升级」为可信类型。

import { ValidationError } from "./errors.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.js";

/** 判断一个值是不是「普通对象」（排除 null、数组、函数等）。 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 校验「创建任务」的请求体。校验失败抛 ValidationError（会被错误中间件接住）。 */
export function parseCreateTask(body: unknown): CreateTaskInput {
  const errors: string[] = [];
  if (!isPlainObject(body)) {
    throw new ValidationError(["请求体必须是一个 JSON 对象"]);
  }

  const { title, done } = body;

  if (typeof title !== "string" || title.trim() === "") {
    errors.push("title 必填，且必须是非空字符串");
  } else if (title.length > 200) {
    errors.push("title 长度不能超过 200 个字符");
  }

  if (done !== undefined && typeof done !== "boolean") {
    errors.push("done 如果提供，必须是布尔值");
  }

  if (errors.length > 0) throw new ValidationError(errors);

  // 走到这里，title 一定是 string，done 一定是 boolean | undefined。
  return {
    title: (title as string).trim(),
    done: done as boolean | undefined,
  };
}

/** 校验「更新任务」的请求体（PATCH）：允许只传部分字段，但不允许一个都不传。 */
export function parseUpdateTask(body: unknown): UpdateTaskInput {
  const errors: string[] = [];
  if (!isPlainObject(body)) {
    throw new ValidationError(["请求体必须是一个 JSON 对象"]);
  }

  const { title, done } = body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      errors.push("title 如果提供，必须是非空字符串");
    } else if (title.length > 200) {
      errors.push("title 长度不能超过 200 个字符");
    }
  }

  if (done !== undefined && typeof done !== "boolean") {
    errors.push("done 如果提供，必须是布尔值");
  }

  if (title === undefined && done === undefined) {
    errors.push("至少要提供 title 或 done 中的一个字段");
  }

  if (errors.length > 0) throw new ValidationError(errors);

  const result: UpdateTaskInput = {};
  if (title !== undefined) result.title = (title as string).trim();
  if (done !== undefined) result.done = done as boolean;
  return result;
}
