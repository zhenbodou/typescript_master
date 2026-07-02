// 文件：code/ch08/01-sync-vs-async.js
// 运行方式：node 01-sync-vs-async.js
// 主题：同步阻塞 vs 异步非阻塞

// 1) 同步（阻塞）：下面这行会“卡住” 1 秒，期间程序什么也干不了
function sleepSyncBlocking(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // 空转，霸占 CPU，谁也别想动
  }
}

console.log("同步版本开始");
console.log("A");
sleepSyncBlocking(1000); // 阻塞 1 秒
console.log("B（1 秒后才打印，期间程序完全卡死）");
console.log("同步版本结束");

// 2) 异步（非阻塞）：setTimeout 把任务“交给未来”，当前代码继续往下跑
console.log("\n异步版本开始");
console.log("C");
setTimeout(() => {
  console.log("D（1 秒后打印，但没有卡住主线程）");
}, 1000);
console.log("E（立刻打印，不用等 D）");
console.log("异步版本结束（注意 D 还没打印，它在未来）");
