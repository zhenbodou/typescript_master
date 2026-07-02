// 文件：code/ch02/07-params.js
// 运行方式：node 07-params.js

// ---------- 默认参数（default parameters）----------
// 调用时没传这个参数（或传了 undefined），就用默认值。
function greet(name, greeting = "你好") {
  return `${greeting}，${name}！`;
}
console.log(greet("小明")); // 用默认的 "你好"
console.log(greet("小红", "早上好")); // 覆盖默认值

// ---------- 剩余参数（rest parameters）----------
// ...nums 把"剩下的所有实参"收进一个真正的数组。
function sum(...nums) {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total;
}
console.log("sum() =", sum());
console.log("sum(1, 2, 3) =", sum(1, 2, 3));
console.log("sum(10, 20, 30, 40) =", sum(10, 20, 30, 40));

// 前面可以有固定参数，rest 必须放最后。
function joinWith(separator, ...words) {
  return words.join(separator);
}
console.log(joinWith("-", "a", "b", "c")); // a-b-c

// ---------- arguments 简介（只在普通函数里有，箭头函数没有）----------
// 它是一个"类数组对象"，历史遗留写法，现在优先用 rest 参数。
function oldStyle() {
  console.log("arguments 长度：", arguments.length);
  console.log("第一个实参：", arguments[0]);
}
oldStyle("x", "y", "z");
