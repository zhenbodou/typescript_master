// 文件：code/ch23/api/src/middleware/logger.ts
// 请求日志中间件：记录每个请求的方法、路径、状态码、耗时。
// 中间件（middleware）本质就是一个 (req, res, next) => void 的函数，
// Express 会按注册顺序把请求「串」着传过每个中间件，调用 next() 才进入下一个。

import type { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // res 是可写流，它在响应发送完毕后会触发 "finish" 事件。
  // 我们等到这时才知道最终状态码和总耗时。
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });

  // 关键：一定要调用 next()，否则请求会「卡」在这里，永远到不了后面的处理器。
  next();
}
