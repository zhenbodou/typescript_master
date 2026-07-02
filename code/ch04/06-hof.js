// 文件：code/ch04/06-hof.js
// 运行方式：node 06-hof.js
// 主题：高阶函数（higher-order function）、纯函数、副作用、IIFE

// 1) 函数作为参数
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}
repeat(3, (i) => console.log("第", i, "次"));

// 2) 数组内置的高阶函数（复习 + 强化）
const nums = [1, 2, 3, 4, 5];
console.log(nums.map((x) => x * x)); // [1,4,9,16,25]
console.log(nums.filter((x) => x % 2 === 0)); // [2,4]
console.log(nums.reduce((sum, x) => sum + x, 0)); // 15

// 3) 函数作为返回值（函数工厂）
function greaterThan(n) {
  return (m) => m > n;
}
const greaterThan10 = greaterThan(10);
console.log(greaterThan10(11)); // true
console.log(greaterThan10(9)); // false

// 4) 纯函数 vs 有副作用的函数
// 纯函数：相同输入必得相同输出，且不改动外部状态
function pureAdd(a, b) {
  return a + b;
}

// 有副作用：修改了外部变量
let total = 0;
function impureAdd(n) {
  total += n; // 副作用：改了外部的 total
  return total;
}
console.log(pureAdd(2, 3)); // 5，可无限次调用都一样
console.log(impureAdd(2)); // 2
console.log(impureAdd(2)); // 4，同样的输入却给出不同结果

// 5) IIFE（立即执行函数表达式）：定义完立刻执行，制造独立作用域
const config = (function () {
  const secret = "1234"; // 外部访问不到
  return { version: "1.0", check: (s) => s === secret };
})();
console.log(config.version); // 1.0
console.log(config.check("1234")); // true
console.log(config.secret); // undefined
