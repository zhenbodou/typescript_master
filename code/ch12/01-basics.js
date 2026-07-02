// 文件：code/ch12/01-basics.js
// 运行：node code/ch12/01-basics.js
// 本文件演示：创建正则的两种方式、flags、test/exec 的基本用法。

// 1) 字面量方式：两个斜杠之间写模式，斜杠后面写 flags。
const re1 = /hello/i; // i = 忽略大小写（ignore case）
console.log("1) test:", re1.test("Hello, world")); // true

// 2) 构造函数方式：模式是字符串，适合"模式在运行时才拼出来"的场景。
const word = "hello";
const re2 = new RegExp(word, "i");
console.log("2) test:", re2.test("HELLO")); // true

// ⚠️ 用字符串写模式时，反斜杠要写两个：JS 字符串先吃掉一层。
const digitLiteral = /\d+/; // 字面量里一个反斜杠就够
const digitCtor = new RegExp("\\d+"); // 字符串里必须写两个
console.log("3) 字面量匹配:", digitLiteral.test("abc123")); // true
console.log("4) 构造匹配:", digitCtor.test("abc123")); // true

// 5) exec：返回一个"匹配结果数组"，没匹配到返回 null。
const m = /(\d+)-(\d+)/.exec("范围 12-34 结束");
console.log("5) exec:", m[0], m[1], m[2], "index=", m.index);
// m[0] 是整段匹配 "12-34"，m[1]/m[2] 是两个分组
