// 文件：code/ch04/01-scope.js
// 运行方式：node 01-scope.js
// 主题：作用域（全局 / 函数 / 块级）与作用域链

// 1) 全局作用域：函数外声明的变量，函数内部也能访问
const appName = "mini-lodash";

function greet() {
  // outer 是 greet 的"函数作用域"变量
  const outer = "外层";

  function inner() {
    // inner 里没有声明 appName / outer，于是沿"作用域链"向外找
    const innerOnly = "最里层";
    console.log(appName); // 找到全局的 appName
    console.log(outer); // 找到 greet 里的 outer
    console.log(innerOnly); // 自己的
  }

  inner();
  // console.log(innerOnly); // ⚠️ 报错：innerOnly 只在 inner 内部可见
}

greet();

// 2) 块级作用域：let / const 声明的变量只在 { } 内有效
{
  const blockVar = "只活在这个块里";
  console.log(blockVar);
}
// console.log(blockVar); // ⚠️ 报错：ReferenceError

// 3) if / for 也是块
if (true) {
  let x = 10;
  console.log("块内 x =", x);
}
// console.log(x); // ⚠️ 报错

// 4) var 没有块级作用域（历史遗留）
if (true) {
  var y = 20; // var 会"泄漏"到函数/全局作用域
}
console.log("var y 泄漏到了外面：y =", y); // 20，能访问到
