// 文件：code/ch03/01-string.js
// 运行方式：node 01-string.js
// 主题：字符串常用方法与"不可变"特性

const s = "Hello, JavaScript";

// 1) length：字符个数（不是方法，没有括号）
console.log("长度：", s.length); // 17

// 2) 索引：像数组一样用方括号取单个字符，从 0 开始
console.log("第 0 个字符：", s[0]); // "H"
console.log("最后一个字符：", s[s.length - 1]); // "t"

// 3) slice(start, end)：截取 [start, end) 区间，支持负数（从末尾数）
console.log("slice(0, 5)：", s.slice(0, 5)); // "Hello"
console.log("slice(7)：", s.slice(7)); // "JavaScript"
console.log("slice(-6)：", s.slice(-6)); // "Script"

// 4) substring(start, end)：和 slice 类似，但不支持负数（负数当 0）
console.log("substring(0, 5)：", s.substring(0, 5)); // "Hello"
console.log("substring(-6)：", s.substring(-6)); // 负数当 0，等于整串

// 5) indexOf / includes：查找子串
console.log("indexOf('Java')：", s.indexOf("Java")); // 7
console.log("indexOf('Python')：", s.indexOf("Python")); // -1（找不到）
console.log("includes('Script')：", s.includes("Script")); // true

// 6) split / join：字符串 <-> 数组
const csv = "苹果,香蕉,橙子";
const fruits = csv.split(","); // ["苹果","香蕉","橙子"]
console.log("split：", fruits);
console.log("join：", fruits.join(" | ")); // "苹果 | 香蕉 | 橙子"

// 7) replace / replaceAll
console.log("replace：", "a-b-c".replace("-", "+")); // 只替换第一个："a+b-c"
console.log("replaceAll：", "a-b-c".replaceAll("-", "+")); // 全部："a+b+c"

// 8) 大小写转换
console.log("toUpperCase：", s.toUpperCase()); // "HELLO, JAVASCRIPT"
console.log("toLowerCase：", s.toLowerCase()); // "hello, javascript"

// 9) trim：去掉首尾空白（中间的不动）
console.log("trim：", "   有空格   ".trim() + "<--"); // "有空格<--"

// 10) padStart / padEnd：补齐到指定长度
console.log("padStart：", "5".padStart(3, "0")); // "005"
console.log("padEnd：", "5".padEnd(3, "0")); // "500"

// 11) repeat：重复
console.log("repeat：", "=".repeat(10)); // "=========="

// 12) 模板字符串复习
const name = "小明";
const age = 18;
console.log(`我叫 ${name}，今年 ${age} 岁，明年 ${age + 1} 岁。`);

// 13) 字符串不可变（immutable）：任何方法都不会改原串，只返回新串
const original = "hello";
const upper = original.toUpperCase();
console.log("原串没变：", original); // "hello"
console.log("新串：", upper); // "HELLO"

// 试图用索引修改字符是无效的：普通模式下静默失败，严格模式/模块里会报错。
// 想"改字符"，本质是用方法生成一个新字符串，再赋回去。
const fixed = "H" + original.slice(1);
console.log("要改就生成新串：", fixed, "原串仍是：", original); // "Hello" "hello"
