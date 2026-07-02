// 文件：code/ch26/app/src/http/app.ts
// 组装 Express 应用：把各层「拼」起来。这里是整个后端的「装配现场」（composition root）——
// 唯一一处知道「用哪个仓储、哪个 service」的地方。把创建 app 和监听端口分开，
// 好让测试能只 import app 而不真的开端口。

import express from "express";
import { TaskRepository } from "../repository/taskRepository.js";
import { TaskService } from "../service/taskService.js";
import { createTasksRouter } from "./tasksRouter.js";
import { errorHandler, notFoundHandler } from "./errorHandler.js";

export interface AppDeps {
  /** 数据库文件路径；传 ":memory:" 用内存库。 */
  dbFile: string;
}

/**
 * 创建应用，并返回 app 与它持有的 repo（方便进程退出时 close，或测试时复用）。
 */
export function createApp(deps: AppDeps) {
  // —— 依赖注入：自底向上组装 repository → service → router ——
  const repo = new TaskRepository(deps.dbFile);
  const service = new TaskService(repo);

  const app = express();

  // 解析 application/json 请求体，挂到 req.body 上。
  app.use(express.json());

  // 健康检查端点，方便部署探活（第 25 章）。
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", time: new Date().toISOString() });
  });

  // 业务路由：把注入了 service 的 router 挂到 /tasks 前缀下。
  app.use("/tasks", createTasksRouter(service));

  // 收尾：404 与统一错误处理，必须放最后。
  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, repo };
}
