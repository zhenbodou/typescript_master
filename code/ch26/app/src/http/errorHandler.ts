// 文件：code/ch26/app/src/http/errorHandler.ts
// 统一错误处理中间件（第 23 章）。它的「魔法特征」：参数是 4 个 (err, req, res, next)，
// Express 靠参数个数为 4 识别它。必须注册在所有路由之后。

import type { Request, Response, NextFunction } from "express";
import { HttpError, ValidationError } from "../domain/errors.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction, // 必须声明第 4 个参数，否则被当成普通中间件
): void {
  // 1) 校验错误：400，并附带具体哪些字段不对。
  if (err instanceof ValidationError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  // 2) 其它已知业务错误（如 404）：用它自带的状态码与消息。
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  // 3) 兜底：未预期错误 → 500。打日志，但不把内部细节暴露给客户端。
  console.error("未处理的错误:", err);
  res.status(500).json({ error: "服务器内部错误" });
}

/** 404 处理：注册在业务路由之后、错误处理之前。 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not Found：请求的路径不存在" });
}
