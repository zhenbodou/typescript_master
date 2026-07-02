// 文件：code/ch12/04-anchors.js
// 运行：node code/ch12/04-anchors.js
// 本文件演示：锚点 ^ $ 与单词边界 \b，以及 m（多行）flag。

// ^ 匹配开头，$ 匹配结尾
console.log("^\\d:", /^\d/.test("1abc"), /^\d/.test("abc1")); // true false
console.log("\\d$:", /\d$/.test("abc1"), /\d$/.test("1abc")); // true false

// 完整匹配一个整数：从头到尾都必须是数字
const isInt = /^\d+$/;
console.log("整数校验:", isInt.test("12345"), isInt.test("12a45")); // true false

// \b 单词边界：单词字符与非单词字符之间的"缝隙"
console.log("\\bcat\\b:", "cat category scatter".match(/\bcat\b/g)); // ['cat']
// 只有独立的 cat 被匹配；category、scatter 里的 cat 不算

// m（multiline）：让 ^ $ 匹配"每一行"的开头/结尾，而不是整段的开头/结尾
const text = "第一行\n第二行\n第三行";
console.log("不带 m:", text.match(/^第.行/g)); // ['第一行']
console.log("带 m:", text.match(/^第.行/gm)); // ['第一行','第二行','第三行']
