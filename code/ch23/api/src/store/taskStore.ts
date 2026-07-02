// 文件：code/ch23/api/src/store/taskStore.ts
// 「数据访问层」：本章先用内存里的数组存数据。
// 第 24 章会把这一层换成真正的数据库，而上层（service / router）几乎不用改。
// 这正是分层的价值：把「数据存在哪」这件事隔离在一个模块里。

import { randomUUID } from "node:crypto";
import type { Task } from "../types.js";

// 内存里的「表」。进程重启就没了——这正是我们要在第 24 章解决的问题。
const tasks: Task[] = [];

export const taskStore = {
  /** 返回全部任务（拷贝一份，避免外部直接改到内部数组）。 */
  findAll(): Task[] {
    return [...tasks];
  },

  /** 按 id 查找，找不到返回 undefined。 */
  findById(id: string): Task | undefined {
    return tasks.find((t) => t.id === id);
  },

  /** 新建任务：服务端负责生成 id 与 createdAt。 */
  create(data: { title: string; done: boolean }): Task {
    const task: Task = {
      id: randomUUID(),
      title: data.title,
      done: data.done,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },

  /** 局部更新：只覆盖传入的字段，返回更新后的任务；找不到返回 undefined。 */
  update(id: string, patch: Partial<Pick<Task, "title" | "done">>): Task | undefined {
    const task = tasks.find((t) => t.id === id);
    if (!task) return undefined;
    if (patch.title !== undefined) task.title = patch.title;
    if (patch.done !== undefined) task.done = patch.done;
    return task;
  },

  /** 删除：删掉返回 true，本来就不存在返回 false。 */
  remove(id: string): boolean {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};
