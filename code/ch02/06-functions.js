// 文件：code/ch02/06-functions.js
// 运行方式：node 06-functions.js

// ---------- 函数声明（function declaration）----------
// 特点：会被"提升"，可以在定义之前调用（见文件末尾）。
function add(a, b) {
  return a + b; // return 把结果交回给调用者
}
console.log("add(2, 3) =", add(2, 3));

// ---------- 函数表达式（function expression）----------
// 把一个函数当作值，赋给变量。不会被提升（变量提升但值还没赋）。
const multiply = function (a, b) {
  return a * b;
};
console.log("multiply(2, 3) =", multiply(2, 3));

// ---------- 箭头函数（arrow function）----------
// 更简洁的写法。单表达式可省略 return 和大括号。
const square = (n) => n * n;
console.log("square(5) =", square(5));

// 多行箭头函数需要大括号，并显式 return。
const describe = (name, age) => {
  const stage = age >= 18 ? "成年" : "未成年";
  return `${name} 已${stage}`;
};
console.log(describe("小红", 16));

// ---------- 没有 return 时返回 undefined ----------
function sayHi(name) {
  console.log("你好，", name);
  // 没有 return
}
const result = sayHi("阿强");
console.log("sayHi 的返回值是：", result); // undefined

// ---------- 函数提升演示 ----------
// 这行能成功，是因为函数声明在解析阶段被整体提升到了顶部。
console.log("提前调用 declared()：", declared());
function declared() {
  return "我是函数声明，可以被提前调用";
}

// 而下面这个如果解开注释会报错：Cannot access 'expr' before initialization
// console.log(expr());
const expr = () => "我是函数表达式，不能被提前调用";
console.log("正常调用 expr()：", expr());
