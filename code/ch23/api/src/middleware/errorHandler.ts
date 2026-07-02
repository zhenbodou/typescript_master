// 文件：code/ch23/api/src/middleware/errorHandler.ts
// 统一错误处理中间件。它有一个「魔法特征」：参数是 4 个 (err, req, res, next)。
// Express 靠「参数个数为 4」来识别错误处理中间件，并且只有当某处
// 抛错 / 调用 next(err) 时才会进入它。它必须注册在所有路由「之后」。

import type { Request, Response, NextFunction } from "express";
import { HttpError, ValidationError } from "../errors.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // 即使不用 next，错误处理中间件也必须声明第 4 个参数，
  // 否则 Express 会把它当成普通中间件。
  _next: NextFunction,
): void {
  // 1) 校验错误：400，并附带具体哪些字段不对。
  if (err instanceof ValidationError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }

  // 2) 其它已知的业务错误（如 404）：用它自带的状态码与消息。
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // 3) 兜底：未预期的错误 → 500。打日志，但不要把内部细节暴露给客户端。
  console.error("未处理的错误:", err);
  res.status(500).json({ error: "服务器内部错误" });
}

// 404 处理：注册在所有业务路由之后、错误处理之前，
// 任何没被前面路由命中的请求都会落到这里。
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not Found：请求的路径不存在" });
}
