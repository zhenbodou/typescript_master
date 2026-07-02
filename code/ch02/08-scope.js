// 文件：code/ch02/08-scope.js
// 运行方式：node 08-scope.js

// ---------- 函数作用域 ----------
// 函数内部声明的变量，外部看不见。
function demo() {
  const inside = "我只在 demo 内部可见";
  console.log(inside);
}
demo();
// console.log(inside); // 解开会报错：inside is not defined

// ---------- 块级作用域（let / const）----------
// { } 组成一个块。let/const 声明的变量只在所在块内有效。
{
  let blockVar = "我在块里";
  console.log(blockVar);
}
// console.log(blockVar); // 解开会报错

// for 循环的 let i 也是块级的，每轮迭代都是新的 i。
for (let i = 0; i < 3; i++) {
  // i 只在这个 for 块里有效
}
// console.log(i); // 解开会报错

// ⚠️ var 没有块级作用域（只有函数作用域），这是它被淘汰的原因之一。
{
  var leaked = "我用 var 声明，居然泄漏到了块外面";
}
console.log(leaked); // 能打印出来！这就是 var 的坑

// ---------- 作用域嵌套：内层能访问外层 ----------
const outer = "外层变量";
function reader() {
  // 函数内部能读到外层作用域的变量，这为第 4 章的"闭包"埋下伏笔。
  console.log("在函数里读到：", outer);
}
reader();
