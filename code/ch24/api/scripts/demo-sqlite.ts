// 文件：code/ch24/api/scripts/demo-sqlite.ts
// SQLite 仓储的可运行演示。
// 运行：npx tsx scripts/demo-sqlite.ts
// 第二次运行时，你会看到上一次的数据【还在】——这就是持久化。

import path from "node:path";
import { fileURLToPath } from "node:url";
import { TaskRepository } from "../src/store/taskRepository.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.resolve(here, "../data/demo.db");

const repo = new TaskRepository(dbFile);

console.log("=== 启动时已有任务数：", repo.findAll().length);

// 1) 新建
const t = repo.create({ title: `任务 ${new Date().toLocaleTimeString()}`, done: false });
console.log("新建：", t);

// 2) 事务批量创建
const many = repo.createMany([{ title: "批量 A" }, { title: "批量 B", done: true }]);
console.log("事务批量创建了", many.length, "条");

// 3) 更新
const updated = repo.update(t.id, { done: true });
console.log("更新后 done =", updated?.done);

// 4) 参数化查询防注入的直观演示：把恶意字符串当作 id 去查，
//    它只会被当成一个「找不到的普通 id」，而不会破坏 SQL。
const evil = "'; DROP TABLE tasks; --";
console.log("用恶意字符串查询结果：", repo.findById(evil)); // undefined，表安然无恙
console.log("表仍在，当前总数：", repo.findAll().length);

// 5) 查看全部
console.log("=== 全部任务 ===");
for (const task of repo.findAll()) {
  console.log(`  [${task.done ? "x" : " "}] ${task.title}  (${task.id.slice(0, 8)})`);
}

repo.close();
console.log("\n提示：再运行一次这个脚本，数据会累积——因为它存进了", path.basename(dbFile));
