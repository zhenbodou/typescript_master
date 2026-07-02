// 文件：code/ch26/app/src/http/tasksRouter.ts
// 路由层（routes）：只管「HTTP 怎么进出」——解析参数、调用 service、决定状态码。
// 用一个工厂函数接收 service，方便注入不同实例（与 app.ts 的依赖注入一脉相承）。

import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { TaskService } from "../service/taskService.js";
import { parseCreateTask, parseUpdateTask } from "../domain/validation.js";

/**
 * 小工具：把「可能抛错的同步处理函数」包一层，任何抛出的错误都转交给 next()，
 * 交由统一错误处理中间件。避免每个路由都写 try/catch。
 */
function wrap(handler: (req: Request, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

/** 解析分页与筛选查询参数。查询参数永远是字符串，需手动转换并兜底。 */
function parseListQuery(req: Request) {
  const { done, page, pageSize } = req.query;

  let doneFilter: boolean | undefined;
  if (done === "true") doneFilter = true;
  else if (done === "false") doneFilter = false;

  const pageNum = Math.max(1, Number.parseInt(String(page ?? "1"), 10) || 1);
  const sizeNum = Math.min(
    100,
    Math.max(1, Number.parseInt(String(pageSize ?? "20"), 10) || 20),
  );

  return { done: doneFilter, page: pageNum, pageSize: sizeNum };
}

export function createTasksRouter(service: TaskService): Router {
  const router = Router();

  // GET /tasks —— 列表，支持 ?done= 筛选与 ?page=&pageSize= 分页。
  router.get(
    "/",
    wrap((req, res) => {
      res.status(200).json(service.list(parseListQuery(req)));
    }),
  );

  // GET /tasks/:id —— 取单个。
  router.get(
    "/:id",
    wrap((req, res) => {
      res.status(200).json(service.getById(req.params.id!));
    }),
  );

  // POST /tasks —— 创建，返回 201 Created，并用 Location 头指向新资源。
  router.post(
    "/",
    wrap((req, res) => {
      const created = service.create(parseCreateTask(req.body));
      res.setHeader("Location", `/tasks/${created.id}`);
      res.status(201).json(created);
    }),
  );

  // PATCH /tasks/:id —— 局部更新，返回更新后的资源。
  router.patch(
    "/:id",
    wrap((req, res) => {
      const updated = service.update(req.params.id!, parseUpdateTask(req.body));
      res.status(200).json(updated);
    }),
  );

  // DELETE /tasks/:id —— 删除成功返回 204（无响应体）。
  router.delete(
    "/:id",
    wrap((req, res) => {
      service.remove(req.params.id!);
      res.status(204).end();
    }),
  );

  return router;
}
