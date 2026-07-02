// 文件：code/ch26/app/src/repository/taskRepository.ts
// 仓储层（repository）：用 Node 内置的 node:sqlite 持久化任务（第 24 章）。
// 只负责「数据怎么存怎么取」，不含任何业务规则。对上层暴露的方法名
// （findAll / findById / create / update / remove）保持稳定，换存储不影响 service。

import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../domain/task.js";

// node:sqlite 是较新的 Node 内置模块。用 createRequire 在运行时加载它，
// 而不是写静态的 `import ... from "node:sqlite"`——这样测试打包器（Vitest 底层的
// Vite）不会试图去「解析/打包」这个内置模块（它的内置名单还不认识 node:sqlite）。
// 运行时行为完全一致：Node 照样返回内置的 DatabaseSync。
const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as typeof import("node:sqlite");

export class TaskRepository {
  private db: InstanceType<typeof DatabaseSync>;

  /**
   * @param dbFile 数据库文件路径。传 ":memory:" 则用纯内存库（进程结束即消失，适合测试）。
   */
  constructor(dbFile: string) {
    this.db = new DatabaseSync(dbFile);
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.migrate();
  }

  /** 建表（如果还不存在）。重复调用是安全的。 */
  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id         TEXT    PRIMARY KEY,
        title      TEXT    NOT NULL,
        done       INTEGER NOT NULL DEFAULT 0,   -- SQLite 没有布尔类型，用 0/1 表示
        created_at TEXT    NOT NULL              -- ISO 8601 字符串
      );
    `);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);`);
  }

  /** 把数据库的一行（snake_case、done 为 0/1）映射成领域模型 Task。 */
  private rowToTask(row: Record<string, unknown>): Task {
    return {
      id: row.id as string,
      title: row.title as string,
      done: (row.done as number) === 1, // 0/1 → boolean
      createdAt: row.created_at as string,
    };
  }

  /** 返回全部任务，按创建时间倒序（最新的在前）。 */
  findAll(): Task[] {
    const rows = this.db
      .prepare("SELECT id, title, done, created_at FROM tasks ORDER BY created_at DESC")
      .all() as Record<string, unknown>[];
    return rows.map((r) => this.rowToTask(r));
  }

  /** 按 id 查找，找不到返回 undefined。 */
  findById(id: string): Task | undefined {
    // ⚠️ 参数化查询（parameterized query）：id 作为参数传给 .get(id)，
    // 永远不会被解释成 SQL —— 这是防 SQL 注入的正解。
    const row = this.db
      .prepare("SELECT id, title, done, created_at FROM tasks WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? this.rowToTask(row) : undefined;
  }

  /** 新建任务：服务端生成 id 与 createdAt。 */
  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      done: input.done ?? false,
      createdAt: new Date().toISOString(),
    };
    this.db
      .prepare("INSERT INTO tasks (id, title, done, created_at) VALUES (?, ?, ?, ?)")
      .run(task.id, task.title, task.done ? 1 : 0, task.createdAt);
    return task;
  }

  /** 局部更新（PATCH 语义）：只覆盖传入的字段。找不到返回 undefined。 */
  update(id: string, patch: UpdateTaskInput): Task | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const next: Task = {
      ...existing,
      title: patch.title ?? existing.title,
      done: patch.done ?? existing.done,
    };
    this.db
      .prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?")
      .run(next.title, next.done ? 1 : 0, next.id);
    return next;
  }

  /** 删除：删掉返回 true，本来就不存在返回 false。 */
  remove(id: string): boolean {
    const result = this.db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return result.changes > 0;
  }

  /** 关闭数据库连接（进程退出前调用）。 */
  close(): void {
    this.db.close();
  }
}
