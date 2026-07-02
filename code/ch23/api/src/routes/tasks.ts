// 文件：code/ch23/api/src/routes/tasks.ts
// 路由模块化：用 express.Router() 把「/tasks 相关」的路由封装成一个独立模块，
// 再挂到主应用上。这样主应用文件保持干净，路由按资源分文件。

import { Router } from "express";
import type { Request, Response } from "express";
import { taskService } from "../services/taskService.js";
import { parseCreateTask, parseUpdateTask } from "../validation.js";

export const tasksRouter = Router();

/**
 * 解析分页与筛选查询参数。查询参数（query string）永远是字符串，
 * 所以要手动转换、并做合理的边界与默认值处理。
 */
function parseListQuery(req: Request) {
  const { done, page, pageSize } = req.query;

  // ?done=true / ?done=false，其它值（或不传）视为「不筛选」。
  let doneFilter: boolean | undefined;
  if (done === "true") doneFilter = true;
  else if (done === "false") doneFilter = false;

  // 分页：转数字，非法或越界时兜底到安全默认值。
  const pageNum = Math.max(1, Number.parseInt(String(page ?? "1"), 10) || 1);
  const sizeNum = Math.min(
    100,
    Math.max(1, Number.parseInt(String(pageSize ?? "10"), 10) || 10),
  );

  return { done: doneFilter, page: pageNum, pageSize: sizeNum };
}

// GET /tasks —— 列表，支持 ?done= 筛选与 ?page=&pageSize= 分页。
tasksRouter.get("/", (req: Request, res: Response) => {
  const query = parseListQuery(req);
  const result = taskService.list(query);
  res.status(200).json(result);
});

// GET /tasks/:id —— 取单个。:id 是「路由参数」，通过 req.params.id 读取。
tasksRouter.get("/:id", (req: Request, res: Response) => {
  const task = taskService.getById(req.params.id);
  res.status(200).json(task);
});

// POST /tasks —— 创建。校验通过后返回 201 Created，并带上新建的资源。
tasksRouter.post("/", (req: Request, res: Response) => {
  const input = parseCreateTask(req.body);
  const created = taskService.create(input);
  // 201 表示「已创建」；按 REST 约定，用 Location 头指向新资源的 URL。
  res.setHeader("Location", `/tasks/${created.id}`);
  res.status(201).json(created);
});

// PATCH /tasks/:id —— 局部更新，返回更新后的资源。
tasksRouter.patch("/:id", (req: Request, res: Response) => {
  const patch = parseUpdateTask(req.body);
  const updated = taskService.update(req.params.id, patch);
  res.status(200).json(updated);
});

// DELETE /tasks/:id —— 删除成功返回 204（无响应体）。
tasksRouter.delete("/:id", (req: Request, res: Response) => {
  taskService.remove(req.params.id);
  res.status(204).end();
});
