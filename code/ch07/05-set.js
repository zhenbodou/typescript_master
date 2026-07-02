// 文件：code/ch07/05-set.js
// Set：去重、集合运算（并/交/差）

// 1) 去重：Set 里每个值唯一
const nums = [1, 2, 2, 3, 3, 3, 4];
const unique = new Set(nums);
console.log("set:", unique); // Set(4) { 1, 2, 3, 4 }
console.log("size:", unique.size); // 4
console.log("去重数组:", [...unique]); // [1,2,3,4]
// 一行去重的常用写法
console.log("一行去重:", [...new Set(nums)]);

// 2) 基本操作：add / has / delete
const s = new Set();
s.add("a").add("b").add("a"); // 重复的 "a" 被忽略
console.log("has a:", s.has("a"));
s.delete("b");
console.log("after delete:", [...s]); // ['a']

// 3) 集合运算：并集、交集、差集
const A = new Set([1, 2, 3, 4]);
const B = new Set([3, 4, 5, 6]);

// 并集 A ∪ B
const union = new Set([...A, ...B]);
console.log("并集:", [...union]); // [1,2,3,4,5,6]

// 交集 A ∩ B：保留同时在 A 和 B 中的
const intersection = new Set([...A].filter((x) => B.has(x)));
console.log("交集:", [...intersection]); // [3,4]

// 差集 A - B：在 A 但不在 B 中的
const difference = new Set([...A].filter((x) => !B.has(x)));
console.log("差集 A-B:", [...difference]); // [1,2]

// 4) Set 也可迭代，支持 for...of
for (const x of A) process.stdout.write(x + " ");
console.log();

export { A, B };
