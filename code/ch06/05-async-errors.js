// 文件：code/ch06/05-async-errors.js
// 运行方式：node 05-async-errors.js
// 主题：同步 vs 异步错误处理（第 8 章会深入 Promise/async，这里点到为止）

// 说明：例 ② 会故意制造一个“未捕获异常”。为了让本文件能完整跑完、
// 把后面的例子也演示出来，这里用 process 的兜底钩子接住它并打印，
// 证明它确实“漏”出了 try/catch。真实项目请不要靠这个来吞错误。
process.on("uncaughtException", (e) => {
  console.log("②（漏网）未捕获异常被 process 兜底：", e.message);
});

// 1) 同步错误：try/catch 抓得住
function syncBoom() {
  throw new Error("同步错误");
}
try {
  syncBoom();
} catch (e) {
  console.log("① 同步错误被 catch 到：", e.message);
}

// 2) “异步回调”里的错误：普通 try/catch 抓不住！
function asyncBoomCallback() {
  try {
    setTimeout(() => {
      // 这个错误在“未来”才抛出，那时 try 早就执行完退出了
      throw new Error("定时器里的错误");
    }, 10);
  } catch (e) {
    // ⚠️ 永远进不来
    console.log("② 这行不会执行");
  }
}
asyncBoomCallback();

// 3) Promise 的错误：要用 .catch()，或在 async 函数里用 try/catch
function mayFail(ok) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ok) resolve("成功数据");
      else reject(new Error("Promise 失败"));
    }, 10);
  });
}

// 3a) 用 .catch
mayFail(false)
  .then((data) => console.log("③ then:", data))
  .catch((e) => console.log("③ Promise 用 .catch 抓到：", e.message));

// 3b) 在 async 函数里，就能用熟悉的 try/catch 了 —— 这是 async/await 的最大好处
async function main() {
  try {
    const data = await mayFail(false); // await 会把 reject 变成“抛错”
    console.log("④ 拿到数据：", data);
  } catch (e) {
    console.log("④ async 里用 try/catch 抓到：", e.message);
  }
}
main();

// 说明：setTimeout 那个例子里的错误会成为“未捕获异常”，被上面的
// process.on("uncaughtException") 兜底打印。这是故意留的“反面教材”，
// 证明普通 try/catch 抓不住异步回调里的错误。
