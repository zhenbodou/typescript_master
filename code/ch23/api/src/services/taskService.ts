// 文件：code/ch23/api/src/services/taskService.ts
// 「业务逻辑层」：把 store 的原始能力组合成对上层有意义的操作，
// 并在这里处理「找不到就报 404」这类业务规则。
// router 只管「HTTP 怎么进出」，service 只管「业务怎么算」，store 只管「数据存哪」。

import { NotFoundError } from "../errors.js";
import { taskStore } from "../store/taskStore.js";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types.js";

/** 列表查询的参数：done 筛选 + 分页。 */
export interface ListQuery {
  done?: boolean; // undefined 表示不筛选
  page: number; // 从 1 开始
  pageSize: number;
}

/** 列表查询的返回：数据 + 分页元信息。 */
export interface ListResult {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
}

export const taskService = {
  list(query: ListQuery): ListResult {
    let all = taskStore.findAll();

    // 1) 按 done 筛选。
    if (query.done !== undefined) {
      all = all.filter((t) => t.done === query.done);
    }

    // 2) 排序：最新创建的排在前面（稳定的默认顺序）。
    all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    // 3) 分页：切出当前页。
    const total = all.length;
    const start = (query.page - 1) * query.pageSize;
    const items = all.slice(start, start + query.pageSize);

    return { items, page: query.page, pageSize: query.pageSize, total };
  },

  /** 按 id 取单个任务，找不到抛 404。 */
  getById(id: string): Task {
    const task = taskStore.findById(id);
    if (!task) throw new NotFoundError(`找不到 id 为 ${id} 的任务`);
    return task;
  },

  create(input: CreateTaskInput): Task {
    return taskStore.create({
      title: input.title,
      done: input.done ?? false, // 默认未完成
    });
  },

  update(id: string, patch: UpdateTaskInput): Task {
    const updated = taskStore.update(id, patch);
    if (!updated) throw new NotFoundError(`找不到 id 为 ${id} 的任务`);
    return updated;
  },

  remove(id: string): void {
    const ok = taskStore.remove(id);
    if (!ok) throw new NotFoundError(`找不到 id 为 ${id} 的任务`);
  },
};
