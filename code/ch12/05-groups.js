// 文件：code/ch12/05-groups.js
// 运行：node code/ch12/05-groups.js
// 本文件演示：分组 (...)、非捕获 (?:...)、命名捕获、反向引用、| 或。

// 捕获分组：括号里的内容会被单独"抓"出来
const date = "2026-07-02";
const m1 = date.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log("捕获:", m1[1], m1[2], m1[3]); // 2026 07 02

// | 或：匹配多个备选之一。用分组限定"或"的范围。
console.log("cat|dog:", "I have a cat and a dog".match(/cat|dog/g)); // ['cat','dog']
console.log("分组限定或:", "grey gray".match(/gr(a|e)y/g)); // ['grey','gray']

// 非捕获分组 (?:...)：只想分组、不想留捕获结果时用，省内存也更清晰
const m2 = "grey".match(/gr(?:a|e)y/);
console.log("非捕获:", m2[0], "没有 m2[1]:", m2[1]); // grey undefined

// 命名捕获 (?<name>...)：给分组起名字，通过 groups 访问
const m3 = date.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
console.log("命名捕获:", m3.groups.year, m3.groups.month, m3.groups.day);

// 反向引用 \1：要求后面重复前面第 1 个分组匹配到的内容——可用来找叠词
console.log("叠词 (\\w)\\1:", "book cool tree hi".match(/(\w)\1/g)); // ['oo','oo','ee']
// book 的 oo、cool 的 oo、tree 的 ee 都是"同一个字符连着出现两次"
