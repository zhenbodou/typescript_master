// 文件：code/ch08/03-microtask-order.js
// 运行方式：node 03-microtask-order.js
// 主题：经典面试题——setTimeout / Promise / nextTick 的完整顺序（Node 环境）

console.log("start"); // 同步

setTimeout(() => console.log("setTimeout（宏任务）"), 0);

Promise.resolve().then(() => {
  console.log("promise 1（微任务）");
  // 在一个微任务里再注册微任务，会插到微任务队列末尾，仍在宏任务之前被清空
  Promise.resolve().then(() => console.log("promise 1.1（嵌套微任务）"));
});

// process.nextTick 是 Node 独有的队列，独立于 Promise 微任务队列
process.nextTick(() => console.log("nextTick（Node 独有队列）"));

Promise.resolve().then(() => console.log("promise 2（微任务）"));

console.log("end"); // 同步

// 本机（Node 24）实测输出顺序：
//   start
//   end
//   promise 1（微任务）
//   promise 2（微任务）
//   promise 1.1（嵌套微任务）
//   nextTick（Node 独有队列）
//   setTimeout（宏任务）
//
// 关键规律（一定成立）：
//   1) 所有“同步代码”最先跑完（start、end）。
//   2) 所有“微任务”（Promise.then / queueMicrotask / nextTick）都在“任何宏任务
//      （setTimeout）”之前清空。
//   3) 微任务里再产生的微任务（promise 1.1），仍在本轮一起被清空，不会拖到下一轮宏任务后。
//
// ⚠️ 关于 nextTick 与 Promise 的“谁先”：网上流传“nextTick 永远优先于 Promise”，
//    但这只在“从同一次回调内部”排队时严格成立。在顶层脚本里同时排队时，不同 Node
//    版本表现可能不同（本机实测 Promise 先、nextTick 后）。所以：不要依赖 nextTick 和
//    Promise 之间的相对顺序，你能依赖的是——它们都属于微任务，都早于 setTimeout。
