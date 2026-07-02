// 文件：code/ch02/09-recursion.js
// 运行方式：node 09-recursion.js

// 递归：函数自己调用自己。关键是要有"终止条件（base case）"。
// 阶乘 n! = n * (n-1) * ... * 1，且规定 0! = 1。
function factorial(n) {
  // 终止条件：递归必须有一个不再往下调用的出口，否则会无限递归。
  if (n <= 1) {
    return 1;
  }
  // 递归步骤：把 factorial(n) 拆成 n * factorial(n-1)。
  return n * factorial(n - 1);
}

console.log("0! =", factorial(0));
console.log("1! =", factorial(1));
console.log("5! =", factorial(5)); // 120
console.log("10! =", factorial(10)); // 3628800

// 把执行过程想成"层层展开再层层收回"：
// factorial(3)
//   = 3 * factorial(2)
//   = 3 * (2 * factorial(1))
//   = 3 * (2 * 1)
//   = 6

// 💡 很多递归都能改写成循环。用循环实现同样的阶乘：
function factorialLoop(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
console.log("循环版 5! =", factorialLoop(5));
