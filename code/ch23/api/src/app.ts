// 文件：code/ch23/api/src/app.ts
// 组装 Express 应用：注册中间件、挂载路由、装上错误处理。
// 把「创建 app」和「监听端口」分开，是为了让测试可以只 import app 而不真的开端口。

import express from "express";
import { requestLogger } from "./middleware/logger.js";
import { simpleCors } from "./middleware/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { tasksRouter } from "./routes/tasks.js";

export function createApp() {
  const app = express();

  // —— 全局中间件，注册顺序 = 执行顺序 ——
  // 1) CORS：尽早处理，好让预检 OPTIONS 请求快速返回。
  app.use(simpleCors);
  // 2) 日志：记录每个进来的请求。
  app.use(requestLogger);
  // 3) express.json()：把 Content-Type 为 application/json 的请求体
  //    解析成 JS 对象，挂到 req.body 上。没有它，req.body 是 undefined。
  app.use(express.json());

  // 健康检查端点，方便部署时探活。
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // —— 业务路由 ——
  // 把 tasksRouter 挂到 /tasks 前缀下：router 里写的 "/" 实际就是 "/tasks"。
  app.use("/tasks", tasksRouter);

  // —— 收尾：404 与统一错误处理，必须放在最后 ——
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
