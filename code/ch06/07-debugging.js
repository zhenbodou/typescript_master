// 文件：code/ch06/07-debugging.js
// 运行方式：node 07-debugging.js
// 主题：调试技巧 —— console 家族、console.assert、读懂调用栈、debugger 语句

// 1) console 家族
console.log("① console.log：最常用的打印");
console.error("② console.error：输出到 stderr（错误流），常用红色");
console.warn("③ console.warn：警告");

// console.table：把数组/对象以表格形式展示，一眼看清结构
const users = [
  { id: 1, name: "小明", age: 20 },
  { id: 2, name: "小红", age: 22 },
];
console.log("\n④ console.table：");
console.table(users);

// console.dir：查看对象的“属性结构”，可控制深度
const nested = { a: { b: { c: { d: 1 } } } };
console.log("\n⑤ console.dir（depth: 2）：");
console.dir(nested, { depth: 2 });

// 2) console.assert：条件为假时才打印（真时静默），适合做“健康检查”
const sum = 2 + 2;
console.assert(sum === 4, "数学坏了：2+2 应该等于 4");
console.assert(sum === 5, "⑥ 这条会打印，因为 2+2 不等于 5");

// 3) 读懂调用栈（stack trace）：谁调用了谁
function level3() {
  // 主动打印当前调用栈，不抛错也能看
  console.log("\n⑦ 当前调用栈：");
  console.log(new Error("仅用于查看栈").stack);
}
function level2() {
  level3();
}
function level1() {
  level2();
}
level1();
// 栈是“倒着读”的：最上面是出错点 level3，往下依次是 level2 -> level1。

// 4) 计时：找性能瓶颈
console.time("耗时统计");
let total = 0;
for (let i = 0; i < 1_000_000; i++) total += i;
console.timeEnd("耗时统计"); // 打印这段代码跑了多久

// 5) debugger 语句：配合 `node --inspect-brk 07-debugging.js` 会在这里暂停
//    普通 `node 07-debugging.js` 运行时，debugger 语句会被忽略（不影响运行）。
function buggy(x) {
  debugger; // 打开调试器时会停在这一行，可逐行查看变量
  return x * 2;
}
console.log("\n⑧ buggy(21) =", buggy(21));

console.log(
  "\n提示：想真正断点调试，运行 `node --inspect-brk 07-debugging.js`，" +
    "然后在 Chrome 打开 chrome://inspect，或用 VS Code 的调试器。"
);
