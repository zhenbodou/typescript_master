// 文件：code/ch01/04-operators.js
// 运行方式：node 04-operators.js

// ===== 算术运算符 =====
console.log("加：", 7 + 3); // 10
console.log("减：", 7 - 3); // 4
console.log("乘：", 7 * 3); // 21
console.log("除：", 7 / 3); // 2.333...
console.log("取余：", 7 % 3); // 1（余数，常用来判断奇偶）
console.log("幂：", 2 ** 10); // 1024（2 的 10 次方）

// ===== 赋值运算符（简写）=====
let n = 10;
n += 5; // 等价于 n = n + 5
console.log("n += 5 ->", n); // 15
n *= 2; // 等价于 n = n * 2
console.log("n *= 2 ->", n); // 30

// ===== 比较：== 与 === 的区别（重点！）=====
console.log("1 == '1' ?", 1 == "1"); // true：先转类型再比较（宽松相等）
console.log("1 === '1' ?", 1 === "1"); // false：类型不同直接判 false（严格相等）
console.log("0 == false ?", 0 == false); // true（隐式转换的坑）
console.log("0 === false ?", 0 === false); // false
console.log("null == undefined ?", null == undefined); // true（特例）
console.log("null === undefined ?", null === undefined); // false

// ===== 逻辑运算符与短路求值 =====
console.log("true && false ->", true && false); // false
console.log("true || false ->", true || false); // true
console.log("!true ->", !true); // false

// && 返回第一个"假值"或最后一个值；|| 返回第一个"真值"或最后一个值
console.log("'' || '默认名' ->", "" || "默认名"); // 默认名
console.log("'张三' && '已登录' ->", "张三" && "已登录"); // 已登录

// ===== 三元运算符 =====
const score = 72;
const result = score >= 60 ? "及格" : "不及格";
console.log("三元判断：", result); // 及格

// ===== ?? 空值合并 =====
const count = 0;
console.log("0 || 5 ->", count || 5); // 5（0 被当成假值，不理想）
console.log("0 ?? 5 ->", count ?? 5); // 0（?? 只在 null/undefined 时取右边）

// ===== ?. 可选链（简介）=====
const user = { name: "小红" }; // 没有 address 属性
console.log("user.address?.city ->", user.address?.city); // undefined，而不是报错
