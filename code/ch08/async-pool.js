// 文件：code/ch08/async-pool.js
// 运行方式：node async-pool.js
// 本章小项目：并发请求限流器 asyncPool

import { delay } from "./08-delay.js";

/**
 * asyncPool —— 并发限流执行器
 * 同时最多 limit 个任务在跑，完成一个立刻补一个，直到全部做完。
 *
 * @param {number} limit  最大并发数（>=1；传 Infinity 表示不限制）
 * @param {Array}  items  输入数据数组
 * @param {(item, index) => Promise} iteratorFn  对每个 item 返回一个 Promise 的函数
 * @returns {Promise<Array>}  与 items 顺序一一对应的结果数组
 */
export async function asyncPool(limit, items, iteratorFn) {
  const results = new Array(items.length); // 预分配，保证结果顺序 = 输入顺序
  let nextIndex = 0; // 下一个待认领的任务下标（共享游标）

  // 一个 worker（工人）：不断从队列里“认领”下一个任务来做，直到没活了
  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++; // 认领当前任务，并把游标推进（同步操作，不会被打断）
      results[current] = await iteratorFn(items[current], current);
    }
  }

  // 启动 min(limit, 任务数) 个 worker，让它们并行地抢任务
  const workerCount = Math.min(limit, items.length);
  const workers = [];
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }

  // 等所有 worker 都把活干完
  await Promise.all(workers);
  return results;
}

// ---------- 下面是演示：只有直接运行本文件时才执行 ----------
if (import.meta.url === `file://${process.argv[1]}`) {
  // 模拟异步任务：每个耗时 200ms，返回它的平方
  const items = [1, 2, 3, 4, 5, 6];
  const iteratorFn = async (n, i) => {
    const started = Date.now();
    await delay(200); // 假装在发网络请求
    console.log(`  任务#${i}（值=${n}）完成，用时约 ${Date.now() - started}ms`);
    return n * n;
  };

  async function bench(limit) {
    const label = limit === Infinity ? "Infinity（全并发）" : String(limit);
    console.log(`\n=== limit = ${label} ===`);
    const t0 = Date.now();
    const results = await asyncPool(limit, items, iteratorFn);
    console.log(`结果（顺序对应输入）：`, results);
    console.log(`总耗时：约 ${Date.now() - t0}ms`);
  }

  (async () => {
    // 6 个任务，每个 200ms：
    await bench(1); // 串行：6 * 200 ≈ 1200ms
    await bench(3); // 三并发：分 2 批 ≈ 400ms
    await bench(Infinity); // 全并发：一批 ≈ 200ms
    console.log("\n注意：三种情况结果都是 [1,4,9,16,25,36]，顺序始终对应输入。");
  })();
}
