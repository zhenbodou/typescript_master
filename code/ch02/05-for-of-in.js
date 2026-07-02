// 文件：code/ch02/05-for-of-in.js
// 运行方式：node 05-for-of-in.js

// for...of：遍历"值"，适合数组。
console.log("--- for...of 遍历数组的值 ---");
const fruits = ["苹果", "香蕉", "橙子"];
for (const fruit of fruits) {
  console.log(fruit);
}

// for...in：遍历"键（key）"。数组的键是下标字符串 "0" "1" "2"。
console.log("--- for...in 遍历键 ---");
for (const index of Object.keys(fruits)) {
  // 这里用 for...of + Object.keys 是更安全的写法，后面解释原因
  console.log(index, "=>", fruits[index]);
}

// for...in 最常见的正当用途：遍历对象的属性名。
console.log("--- for...in 遍历对象 ---");
const person = { name: "小明", age: 18, city: "北京" };
for (const key in person) {
  console.log(key, ":", person[key]);
}

// ⚠️ 陷阱：不要用 for...in 遍历数组。
// 1) 它遍历的是"键"（字符串），不是值；
// 2) 顺序不保证；
// 3) 会连"额外挂上去的属性"一起遍历出来。
console.log("--- for...in 遍历数组的陷阱 ---");
const arr = [10, 20, 30];
arr.extra = "我是额外属性"; // 给数组挂了个属性
for (const key in arr) {
  console.log("key =", key, typeof key); // 注意 key 是字符串，还会打印出 extra
}

// 💡 记忆口诀：数组用 for...of（要值），对象用 for...in（要键）。
