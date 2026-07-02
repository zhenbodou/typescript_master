// 文件：code/ch02/01-if.js
// 运行方式：node 01-if.js

// 假设这是某个用户的分数，你可以改成不同的值反复运行体会分支。
const score = 76;

// if / else if / else：从上往下逐个判断，命中第一个为真的分支就执行，
// 执行完整个结构就结束，后面的分支不再检查。
if (score >= 90) {
  console.log("优秀");
} else if (score >= 80) {
  console.log("良好");
} else if (score >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}

// 只有一个条件时，else 可以省略。
const isRaining = true;
if (isRaining) {
  console.log("记得带伞");
}

// ⚠️ 常见错误：把赋值 = 当成了比较 ==/===。
// 下面这行永远为真（因为它是"把 1 赋给 x 后取 x 的值"），初学者极易踩坑。
let x = 0;
if ((x = 1)) {
  console.log("这行一定会执行，因为 x 被赋成了 1（真值）");
}
console.log("现在 x 的值被改成了：", x);
