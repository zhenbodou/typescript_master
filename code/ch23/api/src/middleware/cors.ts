// 文件：code/ch23/api/src/middleware/cors.ts
// 一个极简的 CORS 中间件，帮助读者理解 CORS 本质就是「加几个响应头」。
// 生产环境请用成熟的 cors 包，并把 origin 收窄到你信任的域名，而不是 "*"。

import type { Request, Response, NextFunction } from "express";

export function simpleCors(req: Request, res: Response, next: NextFunction): void {
  // 允许任意来源访问（演示用；真实项目应指定具体域名）。
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 浏览器在跨域「非简单请求」前会先发一个 OPTIONS 预检（preflight）请求，
  // 我们直接回 204（无内容）表示「允许」，不用往后走业务逻辑。
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
}
