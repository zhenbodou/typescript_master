// 文件：code/ch08/02-event-loop.js
// 运行方式：node 02-event-loop.js
// 主题：事件循环——宏任务(macrotask) vs 微任务(microtask) 的执行顺序

console.log("1 —— 同步：脚本一开始就执行");

setTimeout(() => {
  console.log("5 —— 宏任务：setTimeout 回调（任务队列）");
}, 0);

Promise.resolve().then(() => {
  console.log("3 —— 微任务：第一个 Promise.then");
});

queueMicrotask(() => {
  console.log("4 —— 微任务：queueMicrotask（和 then 同属微任务队列）");
});

console.log("2 —— 同步：脚本最后一行");

// 预期输出顺序：1, 2, 3, 4, 5
// 解释：
//   同步代码先跑完（1、2）；
//   然后清空“微任务队列”（3、4）；
//   最后才轮到“宏任务队列”里的 setTimeout（5）。
