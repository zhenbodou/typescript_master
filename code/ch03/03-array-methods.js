// 文件：code/ch03/03-array-methods.js
// 运行方式：node 03-array-methods.js
// 主题：数组的函数式方法（本章重中之重）

const nums = [1, 2, 3, 4, 5, 6];

// 1) forEach：只遍历，不返回新数组（返回 undefined）
console.log("--- forEach ---");
nums.forEach((n, i) => {
  console.log(`索引 ${i} 的值是 ${n}`);
});

// 2) map：把每个元素"映射"成新值，返回等长的新数组
console.log("--- map ---");
const doubled = nums.map((n) => n * 2);
console.log("翻倍：", doubled); // [2,4,6,8,10,12]
console.log("原数组没变：", nums); // [1,2,3,4,5,6]

// 3) filter：保留"回调返回 true"的元素，返回新数组（长度可能变短）
console.log("--- filter ---");
const evens = nums.filter((n) => n % 2 === 0);
console.log("偶数：", evens); // [2,4,6]

// 4) reduce：把整个数组"归并"成一个值
//    reduce((累加器, 当前值) => 新累加器, 初始值)
console.log("--- reduce ---");
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("求和：", sum); // 21
const max = nums.reduce((acc, n) => (n > acc ? n : acc), nums[0]);
console.log("最大值：", max); // 6
// reduce 还能"变形"：统计每个元素出现次数
const words = ["a", "b", "a", "c", "b", "a"];
const count = words.reduce((acc, w) => {
  acc[w] = (acc[w] || 0) + 1;
  return acc;
}, {});
console.log("词频统计：", count); // { a: 3, b: 2, c: 1 }

// 5) find / findIndex：找第一个满足条件的（元素 / 索引）
console.log("--- find / findIndex ---");
console.log("第一个 > 3 的：", nums.find((n) => n > 3)); // 4
console.log("它的索引：", nums.findIndex((n) => n > 3)); // 3
console.log("找不到时 find：", nums.find((n) => n > 99)); // undefined
console.log("找不到时 findIndex：", nums.findIndex((n) => n > 99)); // -1

// 6) some / every：返回布尔值
console.log("--- some / every ---");
console.log("有没有偶数：", nums.some((n) => n % 2 === 0)); // true
console.log("是不是都 > 0：", nums.every((n) => n > 0)); // true

// 7) sort：排序（⚠️ 会改原数组；默认按"字符串"比较！）
console.log("--- sort ---");
const bad = [10, 2, 1, 20, 3].sort(); // 默认按字符串，结果反直觉
console.log("默认 sort（陷阱）：", bad); // [1, 10, 2, 20, 3]
const good = [10, 2, 1, 20, 3].sort((a, b) => a - b); // 传比较函数才对
console.log("升序：", good); // [1, 2, 3, 10, 20]
const desc = [10, 2, 1, 20, 3].sort((a, b) => b - a);
console.log("降序：", desc); // [20, 10, 3, 2, 1]
// 不想改原数组？先拷贝再排：
const src = [3, 1, 2];
const sorted = [...src].sort((a, b) => a - b);
console.log("原数组保护：", src, "排序结果：", sorted); // [3,1,2] [1,2,3]

// 8) flat / flatMap
console.log("--- flat / flatMap ---");
console.log("flat：", [1, [2, 3], [4, [5]]].flat()); // [1,2,3,4,[5]]
console.log("flat(2)：", [1, [2, [3, [4]]]].flat(2)); // [1,2,3,[4]]
// flatMap = map 之后再 flat 一层，常用于"一个变多个"
const sentences = ["hello world", "foo bar"];
console.log("flatMap：", sentences.flatMap((s) => s.split(" ")));
// ["hello","world","foo","bar"]

// 9) 链式调用：函数式方法的威力所在
console.log("--- 链式调用 ---");
const result = nums
  .filter((n) => n % 2 === 0) // 先筛偶数 [2,4,6]
  .map((n) => n * 10) // 再各乘 10 [20,40,60]
  .reduce((acc, n) => acc + n, 0); // 再求和 120
console.log("偶数各乘10再求和：", result); // 120
