// 文件：code/ch23/api/scripts/smoke.ts
// 冒烟测试：启动 app，用内置 fetch 依次打各端点，断言状态码与响应。
// 运行：npx tsx scripts/smoke.ts   （需先 npm install）
// 这体现了 supertest 的思想——不手动 curl，而是用代码把整套流程跑一遍。

import type { Server } from "node:http";
import { createApp } from "../src/app.js";

const app = createApp();

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("断言失败: " + msg);
  console.log("  ✓ " + msg);
}

// fetch().json() 返回 Promise<unknown>；这里包一层，把结果当作任意结构读取。
// 冒烟脚本只关心运行时行为，故用宽松类型换取简洁。
async function readJson(res: Response): Promise<any> {
  return (await res.json()) as any;
}

async function main() {
  // 监听一个随机可用端口（0 = 让系统分配）。
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 3000;
  const base = `http://localhost:${port}`;

  try {
    console.log("1) 初始列表应为空");
    let res = await fetch(`${base}/tasks`);
    let body = await readJson(res);
    assert(res.status === 200, "GET /tasks → 200");
    assert(body.total === 0 && body.items.length === 0, "初始 total=0");

    console.log("2) 创建任务");
    res = await fetch(`${base}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "写第 23 章" }),
    });
    const created = await readJson(res);
    assert(res.status === 201, "POST /tasks → 201");
    assert(typeof created.id === "string", "返回带 id");
    assert(created.done === false, "done 默认 false");
    const id = created.id as string;

    console.log("3) 校验失败应返回 400");
    res = await fetch(`${base}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    body = await readJson(res);
    assert(res.status === 400, "空 title → 400");
    assert(Array.isArray(body.details), "带 details 数组");

    console.log("4) 按 id 查询");
    res = await fetch(`${base}/tasks/${id}`);
    assert(res.status === 200, "GET /tasks/:id → 200");

    console.log("5) 查询不存在的 id → 404");
    res = await fetch(`${base}/tasks/does-not-exist`);
    assert(res.status === 404, "未知 id → 404");

    console.log("6) PATCH 更新 done");
    res = await fetch(`${base}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    });
    body = await readJson(res);
    assert(res.status === 200, "PATCH → 200");
    assert(body.done === true, "done 已更新为 true");

    console.log("7) 按 done 筛选");
    res = await fetch(`${base}/tasks?done=true`);
    body = await readJson(res);
    assert(body.total === 1, "?done=true → 命中 1 条");
    res = await fetch(`${base}/tasks?done=false`);
    body = await readJson(res);
    assert(body.total === 0, "?done=false → 命中 0 条");

    console.log("8) DELETE 删除");
    res = await fetch(`${base}/tasks/${id}`, { method: "DELETE" });
    assert(res.status === 204, "DELETE → 204");
    res = await fetch(`${base}/tasks/${id}`);
    assert(res.status === 404, "删除后再查 → 404");

    console.log("\n全部冒烟测试通过 ✅");
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error("冒烟测试失败:", err);
  process.exitCode = 1;
});
