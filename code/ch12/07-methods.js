// 文件：code/ch12/07-methods.js
// 运行：node code/ch12/07-methods.js
// 本文件演示：test / match / matchAll / replace / split / exec + lastIndex。

const s = "订单 A-12, B-34, C-56";

// str.match：不带 g 返回带分组的详细结果；带 g 只返回所有整段匹配的数组
console.log("match 无 g:", s.match(/([A-Z])-(\d+)/)); // 含分组、index
console.log("match 有 g:", s.match(/[A-Z]-\d+/g)); // ['A-12','B-34','C-56']

// str.matchAll：返回迭代器，每项都带分组，最适合"全部匹配且要分组"
for (const m of s.matchAll(/([A-Z])-(\d+)/g)) {
  console.log("matchAll:", m[1], "=>", m[2]);
}

// str.replace：$1 引用分组，$<name> 引用命名分组
console.log("replace $:", s.replace(/([A-Z])-(\d+)/g, "$1$2"));
// 函数替换：拿到每次匹配，动态计算替换内容
console.log(
  "replace 函数:",
  s.replace(/(\d+)/g, (whole) => Number(whole) * 2)
); // 数字翻倍

// str.split：用正则切分
console.log("split:", "a1b22c333d".split(/\d+/)); // ['a','b','c','d']

// exec + lastIndex（g 标志的坑）：带 g 的正则是"有状态"的，
// 每次 exec 从 lastIndex 继续，配合 while 循环遍历全部匹配。
const re = /[A-Z]-\d+/g;
let match;
while ((match = re.exec(s)) !== null) {
  console.log("exec:", match[0], "下次从", re.lastIndex, "开始");
}

// ⚠️ 陷阱：把带 g 的正则放进循环反复 test，lastIndex 会乱跳。
const bad = /\d/g;
console.log("坑演示:", bad.test("1"), bad.test("1"), bad.test("1"));
// true false true —— 状态残留导致结果不稳定！
