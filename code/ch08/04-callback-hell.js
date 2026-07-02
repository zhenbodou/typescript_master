// 文件：code/ch08/04-callback-hell.js
// 运行方式：node 04-callback-hell.js
// 主题：回调(callback) 与“回调地狱”(callback hell)

// 模拟一个“异步读取”：ms 毫秒后，用回调把结果交出去
// 约定：Node 风格回调 —— 第一个参数是 error，第二个才是数据
function fakeRead(name, ms, cb) {
  setTimeout(() => {
    if (!name) {
      cb(new Error("名字不能为空")); // 出错时把 error 传回去
      return;
    }
    cb(null, `【${name} 的内容】`); // 成功：error 为 null
  }, ms);
}

// 1) 回调地狱：三个步骤有先后依赖，只能一层层嵌套，缩进越陷越深
console.log("开始回调地狱版本...");
fakeRead("a.txt", 100, (err1, data1) => {
  if (err1) return console.error(err1);
  console.log("读到：", data1);
  fakeRead("b.txt", 100, (err2, data2) => {
    if (err2) return console.error(err2);
    console.log("读到：", data2);
    fakeRead("c.txt", 100, (err3, data3) => {
      if (err3) return console.error(err3);
      console.log("读到：", data3);
      console.log("三步都完成了——但代码已经缩进成金字塔（callback hell）");
    });
  });
});

// 问题：1) 层层缩进像“厄运金字塔”；2) 每层都要手动 if(err) 处理错误；
//       3) 无法用 return 值，只能靠回调传；4) 组合/并行很难写。
// 第 8 章接下来用 Promise 和 async/await 把它拉平。
