// 文件：code/ch01/05-conversion.js
// 运行方式：node 05-conversion.js

// ===== 显式转换：你主动调用函数 =====

// 1) 转数字 Number()
console.log("Number('42') ->", Number("42")); // 42
console.log("Number('3.14') ->", Number("3.14")); // 3.14
console.log("Number('') ->", Number("")); // 0（空字符串转成 0！）
console.log("Number('abc') ->", Number("abc")); // NaN（转不了就是 NaN）
console.log("Number(true) ->", Number(true)); // 1
console.log("Number(false) ->", Number(false)); // 0
console.log("Number(null) ->", Number(null)); // 0
console.log("Number(undefined) ->", Number(undefined)); // NaN

// parseInt / parseFloat：从字符串"开头"能读多少读多少
console.log("parseInt('42px') ->", parseInt("42px")); // 42
console.log("parseFloat('3.14m') ->", parseFloat("3.14m")); // 3.14

// 2) 转字符串 String()
console.log("String(42) ->", String(42)); // "42"
console.log("String(true) ->", String(true)); // "true"
console.log("String(null) ->", String(null)); // "null"

// 3) 转布尔 Boolean()
console.log("Boolean(1) ->", Boolean(1)); // true
console.log("Boolean(0) ->", Boolean(0)); // false
console.log("Boolean('') ->", Boolean("")); // false
console.log("Boolean('hi') ->", Boolean("hi")); // true

// ===== 假值（falsy）全家福：只有这 6 个会被当成 false =====
console.log("--- 6 个假值 ---");
console.log(Boolean(false)); // false
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
// 其余一切（包括 "0"、"false"、[]、{}）都是真值（truthy）
console.log('Boolean("0") ->', Boolean("0")); // true！字符串 "0" 是真值
console.log("Boolean([]) ->", Boolean([])); // true！空数组是真值

// ===== 隐式转换：JS 偷偷帮你转（陷阱重灾区）=====
console.log("--- 隐式转换 ---");
console.log("'5' + 3 ->", "5" + 3); // "53"：+ 遇到字符串就变拼接
console.log("'5' - 3 ->", "5" - 3); // 2：- 只能算数，把 '5' 转成数字
console.log("'5' * '2' ->", "5" * "2"); // 10：都转成数字
console.log("true + 1 ->", true + 1); // 2：true 转成 1
console.log("[] + [] ->", [] + []); // ""（空字符串，很反直觉）
