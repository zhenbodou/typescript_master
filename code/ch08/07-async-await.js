// 文件：code/ch08/07-async-await.js
// 运行方式：node 07-async-await.js
// 主题：async/await —— 用“同步的写法”写异步；try/catch 处理错误；串行 vs 并行

import { delay } from "./08-delay.js";

// async 函数一定返回 Promise：return 的值会被包进 resolve
async function readFile(name, ms) {
  await delay(ms); // await 会“暂停”这个函数，直到 delay 的 Promise 落定
  if (!name) throw new Error("名字不能为空"); // throw 会让返回的 Promise 变成 reject
  return `【${name} 的内容】`;
}

// 1) 用 try/catch 处理异步错误 —— 这是 async/await 相比 .then/.catch 最大的甜头
async function demoErrorHandling() {
  try {
    const data = await readFile("a.txt", 100);
    console.log("① 拿到：", data);
    await readFile("", 50); // 会抛错
    console.log("这行不会执行");
  } catch (e) {
    console.log("① try/catch 抓到异步错误：", e.message);
  }
}

// 2) 串行（serial）：一个 await 接一个，后一个必须等前一个完成
async function demoSerial() {
  const t0 = Date.now();
  const a = await readFile("a.txt", 300);
  const b = await readFile("b.txt", 300);
  const c = await readFile("c.txt", 300);
  console.log(`② 串行结果：${a} ${b} ${c}`);
  console.log(`② 串行耗时：约 ${Date.now() - t0}ms（300+300+300≈900）`);
}

// 3) 并行（parallel）：三个任务互不依赖，就该同时发起，再用 Promise.all 一起等
async function demoParallel() {
  const t0 = Date.now();
  // 先“发起”三个 Promise（此刻它们已经在并行跑了），再一起 await
  const [a, b, c] = await Promise.all([
    readFile("a.txt", 300),
    readFile("b.txt", 300),
    readFile("c.txt", 300),
  ]);
  console.log(`③ 并行结果：${a} ${b} ${c}`);
  console.log(`③ 并行耗时：约 ${Date.now() - t0}ms（三者同时跑≈300）`);
}

async function main() {
  await demoErrorHandling();
  await demoSerial();
  await demoParallel();
}

main();
