// 文件：code/ch26/app/test/taskService.test.ts
// service + repository 的集成测试（第 22 章 Vitest）。
// 用内存库（":memory:"）：每个测试用例都拿到一个全新的、互不干扰的数据库，
// 快、且不落盘。这正是「依赖注入 + 分层」带来的可测性红利。

import { describe, it, expect, beforeEach } from "vitest";
import { TaskRepository } from "../src/repository/taskRepository.js";
import { TaskService } from "../src/service/taskService.js";
import { NotFoundError } from "../src/domain/errors.js";

function makeService(): TaskService {
  return new TaskService(new TaskRepository(":memory:"));
}

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = makeService();
  });

  it("create 后能在 list 中查到", () => {
    const created = service.create({ title: "买菜" });
    expect(created.id).toBeTruthy();
    expect(created.done).toBe(false);

    const { items, total } = service.list({ page: 1, pageSize: 20 });
    expect(total).toBe(1);
    expect(items[0]?.title).toBe("买菜");
  });

  it("getById 找不到时抛 NotFoundError", () => {
    expect(() => service.getById("不存在的-id")).toThrow(NotFoundError);
  });

  it("update 能把任务标记为完成", () => {
    const t = service.create({ title: "写代码" });
    const updated = service.update(t.id, { done: true });
    expect(updated.done).toBe(true);
    // 再查一次，确认已持久化（这里是内存库，但走的是同一套 SQL）。
    expect(service.getById(t.id).done).toBe(true);
  });

  it("list 支持 done 筛选", () => {
    const a = service.create({ title: "A" });
    service.create({ title: "B" });
    service.update(a.id, { done: true });

    const doneOnly = service.list({ done: true, page: 1, pageSize: 20 });
    expect(doneOnly.total).toBe(1);
    expect(doneOnly.items[0]?.title).toBe("A");

    const todoOnly = service.list({ done: false, page: 1, pageSize: 20 });
    expect(todoOnly.total).toBe(1);
    expect(todoOnly.items[0]?.title).toBe("B");
  });

  it("remove 后再删同一个 id 抛 NotFoundError", () => {
    const t = service.create({ title: "临时" });
    service.remove(t.id); // 第一次成功
    expect(() => service.remove(t.id)).toThrow(NotFoundError); // 第二次找不到
  });

  it("list 分页：第 2 页只返回剩下的", () => {
    for (let i = 0; i < 5; i++) service.create({ title: `T${i}` });
    const page2 = service.list({ page: 2, pageSize: 2 });
    expect(page2.total).toBe(5);
    expect(page2.items).toHaveLength(2);
  });
});
