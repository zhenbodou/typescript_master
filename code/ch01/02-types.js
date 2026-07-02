// 文件：code/ch01/02-types.js
// 运行方式：node 02-types.js

// ===== 1. number（数字）=====
const intNum = 42; // 整数
const floatNum = 3.14; // 小数
const negNum = -7; // 负数
console.log("number：", intNum, floatNum, negNum);

// number 的三个坑：
console.log("0.1 + 0.2 =", 0.1 + 0.2); // 0.30000000000000004（浮点精度）
console.log("1 / 0 =", 1 / 0); // Infinity（无穷大）
console.log("0 / 0 =", 0 / 0); // NaN（Not a Number，不是一个数字）
console.log("NaN === NaN ?", NaN === NaN); // false！NaN 谁都不等，包括它自己

// ===== 2. string（字符串）=====
const single = 'Hello'; // 单引号
const double = "World"; // 双引号，二者等价
console.log("string：", single, double);

// ===== 3. boolean（布尔）=====
const isDone = true;
const isEmpty = false;
console.log("boolean：", isDone, isEmpty);

// ===== 4. undefined 和 null =====
let notAssigned; // 只声明、不赋值 -> undefined
const nothing = null; // 主动表示"这里就是空"
console.log("undefined：", notAssigned);
console.log("null：", nothing);

// ===== 5. bigint（大整数，简介）=====
const big = 9007199254740993n; // 结尾加 n 表示 bigint
console.log("bigint：", big);

// ===== 6. symbol（唯一标识，简介）=====
const id = Symbol("id"); // 每个 symbol 都独一无二
console.log("symbol：", id.toString());

// ===== 用 typeof 查看类型 =====
console.log("--- typeof 一览 ---");
console.log(typeof 42); // "number"
console.log(typeof "hi"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof 10n); // "bigint"
console.log(typeof Symbol()); // "symbol"
console.log(typeof null); // "object"（历史遗留 bug，见正文）
console.log(typeof console.log); // "function"
