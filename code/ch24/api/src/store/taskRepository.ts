// 文件：code/ch24/api/src/store/taskRepository.ts
// 用 Node 内置的 node:sqlite 实现的任务仓储（repository）。
//
// 为什么用 node:sqlite？
//   - Node 22 引入、Node 24 已可直接使用，【无需 npm 安装任何依赖】。
//   - 同步 API（DatabaseSync），对「一个进程、一个文件」的场景又快又简单。
//   - 数据存在一个 .db 文件里，进程重启数据不丢——这正是我们要解决的问题。
//
// 这一层对上层暴露的方法名和第 23 章的内存 store 完全一致
// （findAll / findById / create / update / remove），
// 所以 service / router 层几乎不用改。这就是「分层」的价值。

import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types.js";

export class TaskRepository {
  // DatabaseSync 是一个「打开的数据库连接」。
  private db: DatabaseSync;

  /**
   * @param dbFile 数据库文件路径。传 ":memory:" 则用纯内存库（进程结束即消失，适合测试）。
   */
  constructor(dbFile: string) {
    // 打开（不存在则创建）数据库文件。
    this.db = new DatabaseSync(dbFile);
    // 打开外键约束（SQLite 默认关闭），养成好习惯。
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.migrate();
  }

  /** 建表（如果还不存在）。把「结构初始化」收拢在一个方法里，重复调用是安全的。 */
  private migrate(): void {
    // exec 用来执行「不返回结果、也不带参数」的 SQL。
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id         TEXT    PRIMARY KEY,
        title      TEXT    NOT NULL,
        done       INTEGER NOT NULL DEFAULT 0,   -- SQLite 没有布尔类型，用 0/1 表示
        created_at TEXT    NOT NULL              -- ISO 8601 字符串
      );
    `);
    // 给「按创建时间排序 / 查询」加索引，数据量大时更快（扩展练习会用到）。
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);`);
  }

  /**
   * 把数据库里的一行（列名是 snake_case、done 是 0/1）
   * 映射成领域模型 Task（camelCase、done 是 boolean）。
   */
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
    // ⚠️ 注意这里的 ?：这是【参数化查询】（parameterized query）。
    // 我们把 id 作为「参数」传给 .get(id)，而不是拼进 SQL 字符串。
    // SQLite 会把它当作纯数据处理，永远不会被解释成 SQL —— 这就是防 SQL 注入的正解。
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
    // 四个 ? 一一对应 run() 的四个参数；布尔要转成 0/1。
    this.db
      .prepare("INSERT INTO tasks (id, title, done, created_at) VALUES (?, ?, ?, ?)")
      .run(task.id, task.title, task.done ? 1 : 0, task.createdAt);
    return task;
  }

  /** 局部更新（PATCH 语义）：只覆盖传入的字段。找不到返回 undefined。 */
  update(id: string, patch: UpdateTaskInput): Task | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    // 合并「已有值」和「本次要改的值」，得到更新后的完整任务。
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
    // run() 返回一个结果对象，changes 是「受影响的行数」。
    const result = this.db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return result.changes > 0;
  }

  /**
   * 批量创建，演示【事务】（transaction）。
   * 事务保证「要么全部成功，要么全部回滚」——中途出错不会留下半截脏数据。
   */
  createMany(inputs: CreateTaskInput[]): Task[] {
    const created: Task[] = [];
    // BEGIN 开启事务；COMMIT 提交；出错则 ROLLBACK 撤销这一批的全部写入。
    this.db.exec("BEGIN");
    try {
      for (const input of inputs) {
        created.push(this.create(input));
      }
      this.db.exec("COMMIT");
      return created;
    } catch (err) {
      this.db.exec("ROLLBACK"); // 撤销本次事务里的所有改动
      throw err;
    }
  }

  /** 关闭数据库连接（进程退出前调用）。 */
  close(): void {
    this.db.close();
  }
}
