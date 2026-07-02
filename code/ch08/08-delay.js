// 文件：code/ch08/08-delay.js
// 运行方式：作为工具被 import；也可 node 08-delay.js 看自测
// 主题：可复用的异步工具 delay / sleep

// delay(ms)：返回一个“ms 毫秒后自动 resolve”的 Promise
// 有了它，就能在 async 函数里写 `await delay(1000)` 优雅地“睡一觉”
export function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

// sleep 只是 delay 的别名，很多人习惯叫 sleep
export const sleep = delay;

// delay 的“可拒绝”变体：ms 毫秒后 reject，常用来给别的 Promise 加超时
export function delayReject(ms, reason = new Error("超时")) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(reason), ms);
  });
}

// 自测：只有直接运行本文件时才执行（被 import 时不执行）
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log("睡 300ms...");
    const t0 = Date.now();
    await sleep(300);
    console.log(`醒了，耗时约 ${Date.now() - t0}ms`);
    const v = await delay(100, "带值返回");
    console.log("delay 也能携带返回值：", v);
  })();
}
