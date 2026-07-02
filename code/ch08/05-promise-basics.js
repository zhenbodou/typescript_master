// 文件：code/ch08/05-promise-basics.js
// 运行方式：node 05-promise-basics.js
// 主题：Promise 的三种状态、resolve/reject、then/catch/finally、链式与错误传播

// 1) 手动创建一个 Promise
// 一个 Promise 有三种状态：
//   pending（进行中）→ 最终变成 fulfilled（已成功）或 rejected（已失败），且只能变一次
function fakeRead(name, ms) {
  return new Promise((resolve, reject) => {
    // executor 会立即同步执行；把异步结果通过 resolve/reject 交出去
    setTimeout(() => {
      if (!name) reject(new Error("名字不能为空"));
      else resolve(`【${name} 的内容】`);
    }, ms);
  });
}

// 2) then / catch / finally
fakeRead("a.txt", 100)
  .then((data) => {
    console.log("① then 拿到数据：", data);
  })
  .catch((err) => {
    console.log("① catch：", err.message);
  })
  .finally(() => {
    console.log("① finally：无论成败都会执行（收尾）");
  });

// 3) 链式调用：then 里 return 的值会成为下一个 then 的输入
//    return 一个 Promise，会等它完成再继续（这就是“拉平”回调地狱的关键）
console.log("开始链式版本...");
fakeRead("a.txt", 100)
  .then((d1) => {
    console.log("链 → 读到：", d1);
    return fakeRead("b.txt", 100); // 返回新 Promise，链会等它
  })
  .then((d2) => {
    console.log("链 → 读到：", d2);
    return fakeRead("c.txt", 100);
  })
  .then((d3) => {
    console.log("链 → 读到：", d3);
    console.log("三步完成——注意这次是“平的”，不再是金字塔");
  })
  .catch((err) => {
    // 链条上任何一环 reject 或 throw，都会“跳”到这里，中间的 then 被跳过
    console.log("链 → 出错：", err.message);
  });

// 4) 错误传播演示：中间一步失败，后面的 then 全被跳过，直达 catch
fakeRead("", 50) // 空名字 → reject
  .then((d) => console.log("这行不会执行", d))
  .then((d) => console.log("这行也不会执行", d))
  .catch((err) => console.log("④ 错误一路传播到 catch：", err.message));
