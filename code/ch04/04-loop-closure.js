// 文件：code/ch04/04-loop-closure.js
// 运行方式：node 04-loop-closure.js
// 主题：循环里的闭包经典坑（var vs let）

// 1) 用 var 的坑：三个函数共享同一个 i
console.log("--- 用 var（坑）---");
const funcsVar = [];
for (var i = 0; i < 3; i++) {
  funcsVar.push(function () {
    return i;
  });
}
// 循环结束时 i 已经是 3，三个函数闭的是"同一个" i
console.log(funcsVar[0]()); // 3
console.log(funcsVar[1]()); // 3
console.log(funcsVar[2]()); // 3

// 2) 用 let 修复：每次迭代都有一个"全新的" j
console.log("--- 用 let（正确）---");
const funcsLet = [];
for (let j = 0; j < 3; j++) {
  funcsLet.push(function () {
    return j;
  });
}
console.log(funcsLet[0]()); // 0
console.log(funcsLet[1]()); // 1
console.log(funcsLet[2]()); // 2

// 3) 在没有 let 的年代，用 IIFE + 参数复制来修复
console.log("--- 用 var + IIFE（老写法）---");
const funcsIIFE = [];
for (var k = 0; k < 3; k++) {
  funcsIIFE.push(
    (function (captured) {
      return function () {
        return captured; // captured 是每次循环拷贝的独立副本
      };
    })(k)
  );
}
console.log(funcsIIFE[0]()); // 0
console.log(funcsIIFE[1]()); // 1
console.log(funcsIIFE[2]()); // 2
