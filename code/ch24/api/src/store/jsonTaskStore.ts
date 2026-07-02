// 文件：code/ch24/api/src/store/jsonTaskStore.ts
// 「JSON 文件持久化」版本的仓储——本章讲持久化层次时的过渡方案。
//
// 思路：把内存里的数组，在每次改动后整体写回一个 .json 文件；启动时读回来。
// 优点：零依赖、人可读、适合原型和极小数据量。
// 缺点：
//   1) 每次写都要序列化并覆盖【整个文件】，数据一多就慢。
//   2) ⚠️ 并发写有丢数据风险：两个异步操作同时读到旧内容、各自改、各自写，
//      后写的会覆盖先写的（read-modify-write 竞态）。下面用一个「写入队列」串行化来缓解。
// 这些正是我们最终要转向 SQLite 的原因。

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types.js";

export class JsonTaskStore {
  private tasks: Task[] = [];
  private loaded = false;
  // 写入队列：保证所有写盘操作【串行】执行，避免并发覆盖。
  private writeChain: Promise<void> = Promise.resolve();

  constructor(private file: string) {}

  /** 首次使用前从磁盘加载；文件不存在则视为空列表。 */
  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    try {
      const text = await readFile(this.file, "utf8");
      this.tasks = JSON.parse(text) as Task[];
    } catch (err: unknown) {
      // ENOENT = 文件不存在，属正常（第一次运行）；其它错误照常抛出。
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      this.tasks = [];
    }
    this.loaded = true;
  }

  /** 把当前内存快照写回磁盘。用 writeChain 把多次写串行化，避免竞态。 */
  private persist(): Promise<void> {
    const snapshot = JSON.stringify(this.tasks, null, 2);
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(path.dirname(this.file), { recursive: true });
      await writeFile(this.file, snapshot, "utf8");
    });
    return this.writeChain;
  }

  async findAll(): Promise<Task[]> {
    await this.ensureLoaded();
    return [...this.tasks];
  }

  async create(input: CreateTaskInput): Promise<Task> {
    await this.ensureLoaded();
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      done: input.done ?? false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    await this.persist();
    return task;
  }

  async update(id: string, patch: UpdateTaskInput): Promise<Task | undefined> {
    await this.ensureLoaded();
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    if (patch.title !== undefined) task.title = patch.title;
    if (patch.done !== undefined) task.done = patch.done;
    await this.persist();
    return task;
  }

  async remove(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const i = this.tasks.findIndex((t) => t.id === id);
    if (i === -1) return false;
    this.tasks.splice(i, 1);
    await this.persist();
    return true;
  }
}
