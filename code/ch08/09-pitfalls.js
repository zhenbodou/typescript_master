// 文件：code/ch08/09-pitfalls.js
// 运行方式：node 09-pitfalls.js
// 主题：异步四大常见坑，以及正确写法

import { delay } from "./08-delay.js";

async function getUser(id) {
  await delay(50);
  return { id, name: `用户${id}` };
}

// 坑 1：忘记 await —— 拿到的是 Promise 对象，不是数据
async function pitfallForgetAwait() {
  const user = getUser(1); // ⚠️ 忘了 await
  console.log("坑1 忘记 await：", user); // 打印 Promise { <pending> }，而不是用户
  const userOk = await getUser(1); // ✅
  console.log("坑1 正确：", userOk);
}

// 坑 2：forEach + async —— forEach 不会等待里面的 async，"完成"提前打印
async function pitfallForEach() {
  const ids = [1, 2, 3];
  console.log("坑2 开始 forEach...");
  ids.forEach(async (id) => {
    const u = await getUser(id);
    console.log("坑2 forEach 里拿到（会在‘完成’之后才打印）：", u.name);
  });
  console.log("坑2 forEach 之后：这行会立刻执行，根本没等上面三个！");

  // ✅ 正确 A：串行用 for...of（真的会等）
  console.log("坑2 正确（for...of 串行）：");
  for (const id of ids) {
    const u = await getUser(id);
    console.log("   拿到：", u.name);
  }
  // ✅ 正确 B：并行用 map + Promise.all
  const users = await Promise.all(ids.map((id) => getUser(id)));
  console.log("坑2 正确（map+Promise.all 并行）：", users.map((u) => u.name));
}

// 坑 3：把本可并行的请求写成了串行，白白浪费时间
async function pitfallSerialWaste() {
  const t0 = Date.now();
  const a = await getUser(1); // 串行：等 50ms
  const b = await getUser(2); // 再等 50ms
  console.log(`坑3 串行耗时约 ${Date.now() - t0}ms（≈100，其实互不依赖）`, a.name, b.name);

  const t1 = Date.now();
  const [c, d] = await Promise.all([getUser(1), getUser(2)]); // 并行：一共 50ms
  console.log(`坑3 并行耗时约 ${Date.now() - t1}ms（≈50）`, c.name, d.name);
}

// 坑 4：未捕获的 rejection —— 会成为 UnhandledPromiseRejection
async function pitfallUnhandled() {
  // 正确做法：要么 await 在 try/catch 里，要么 .catch()
  getUser(1)
    .then(() => {
      throw new Error("链里抛了错但没人接");
    })
    .catch((e) => console.log("坑4 正确：用 .catch 兜住了：", e.message));
}

async function main() {
  await pitfallForgetAwait();
  await pitfallForEach();
  await pitfallSerialWaste();
  await pitfallUnhandled();
}

main();
