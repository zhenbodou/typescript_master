// 文件：code/ch02/03-ternary.js
// 运行方式：node 03-ternary.js

// 三元运算符：条件 ? 为真时的值 : 为假时的值
// 它是一个"表达式"，会算出一个结果，因此可以直接赋给变量。
const age = 20;
const label = age >= 18 ? "成年人" : "未成年人";
console.log(label);

// 等价的 if/else 写法（更啰嗦，但逻辑相同）。
let label2;
if (age >= 18) {
  label2 = "成年人";
} else {
  label2 = "未成年人";
}
console.log(label2);

// 💡 适合用三元的场景：根据条件在两个"值"之间二选一。
const n = 7;
console.log(`${n} 是${n % 2 === 0 ? "偶数" : "奇数"}`);

// ⚠️ 不要嵌套过深，可读性会崩。下面这种就该改回 if/else if。
const s = 85;
const grade = s >= 90 ? "A" : s >= 80 ? "B" : s >= 60 ? "C" : "D";
console.log("成绩等级：", grade);
