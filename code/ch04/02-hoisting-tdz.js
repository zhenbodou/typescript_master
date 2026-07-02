// 文件：code/ch04/02-hoisting-tdz.js
// 运行方式：node 02-hoisting-tdz.js
// 主题：变量提升（hoisting）与暂时性死区（TDZ）

// 1) 函数声明整体被提升：调用可以写在定义之前
console.log(add(2, 3)); // 5，正常运行

function add(a, b) {
  return a + b;
}

// 2) var 变量的"声明"被提升，但"赋值"留在原地
console.log("var 提升演示 v =", v); // undefined（不是报错！）
var v = 100;
console.log("赋值后 v =", v); // 100

// 3) let / const 也会被提升，但在声明前处于"暂时性死区（TDZ）"
//    访问它们会直接报错，而不是拿到 undefined
try {
  console.log(letVar); // 在 TDZ 中，抛出 ReferenceError
  let letVar = 1;
} catch (e) {
  console.log("访问 TDZ 中的变量报错：", e.constructor.name);
}

// 📌 结论：优先用 let / const。TDZ 会把"用了还没声明的变量"这种 bug
//    在第一时间以报错形式暴露出来，而不是给你一个诡异的 undefined。
