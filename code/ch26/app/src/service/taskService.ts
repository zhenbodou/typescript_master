// 文件：code/ch26/app/src/service/taskService.ts
// 业务逻辑层（service）：把 repository 的原始能力组合成对上层有意义的操作，
// 并在这里处理「找不到就报 404」「筛选/排序/分页」这类业务规则。
//
// 与第 23 章相比，这里改成【类 + 依赖注入】：service 不再自己去 new 仓储，
// 而是通过构造函数接收一个 TaskRepository。好处是——测试时可以塞一个
// 内存库（":memory:"），无需真正落盘。这就是「依赖注入」（dependency injection）。

import { NotFoundError } from "../domain/errors.js";
import type { TaskRepository } from "../repository/taskRepository.js";
import type {
  CreateTaskInput,
  ListQuery,
  ListResult,
  Task,
  UpdateTaskInput,
} from "../domain/task.js";

export class TaskService {
  constructor(private readonly repo: TaskRepository) {}

  /** 列表：done 筛选 + 分页。仓储已按 createdAt 倒序返回，这里只做筛选与切片。 */
  list(query: ListQuery): ListResult {
    let all = this.repo.findAll();

    // 1) 按 done 筛选。
    if (query.done !== undefined) {
      all = all.filter((t) => t.done === query.done);
    }

    // 2) 分页：切出当前页。
    const total = all.length;
    const start = (query.page - 1) * query.pageSize;
    const items = all.slice(start, start + query.pageSize);

    return { items, page: query.page, pageSize: query.pageSize, total };
  }

  /** 按 id 取单个任务，找不到抛 404。 */
  getById(id: string): Task {
    const task = this.repo.findById(id);
    if (!task) throw new NotFoundError(`找不到 id 为 ${id} 的任务`);
    return task;
  }

  create(input: CreateTaskInput): Task {
    return this.repo.create({
      title: input.title,
      done: input.done ?? false, // 默认未完成
    });
  }

  update(id: string, patch: UpdateTaskInput): Task {
    const updated = this.repo.update(id, patch);
    if (!updated) throw new NotFoundError(`找不到 id 为 ${id} 的任务`);
    return updated;
  }

  remove(id: string): void {
    const ok = this.repo.remove(id);
    if (!ok) throw new NotFoundError(`找不到 id 为 ${id} 的任务`);
  }
}
