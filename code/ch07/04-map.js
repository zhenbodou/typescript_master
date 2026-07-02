// 文件：code/ch07/04-map.js
// Map：任意键类型、有序、size、迭代；对比普通对象

const m = new Map();

// 1) 键可以是任意类型，包括对象、函数、NaN
const objKey = { id: 1 };
const fnKey = () => {};
m.set("name", "小明"); // 字符串键
m.set(42, "数字键"); // 数字键（不会被转成字符串）
m.set(objKey, "对象键"); // 对象键
m.set(fnKey, "函数键");
m.set(NaN, "NaN 也能当键"); // Map 里 NaN 视为等于 NaN

console.log("get name:", m.get("name"));
console.log("get 42:", m.get(42)); // 42 和 "42" 是不同的键
console.log('get "42":', m.get("42")); // undefined
console.log("get objKey:", m.get(objKey));
console.log("get NaN:", m.get(NaN));

// 2) size / has / delete
console.log("size:", m.size); // 5，直接拿数量，无需像对象那样 Object.keys().length
console.log("has 42:", m.has(42));
m.delete(42);
console.log("has 42 after delete:", m.has(42));

// 3) 有序迭代：按插入顺序
const scores = new Map([
  ["语文", 90],
  ["数学", 85],
  ["英语", 88],
]);
for (const [subject, score] of scores) {
  console.log(`${subject} => ${score}`);
}
console.log("keys:", [...scores.keys()]);
console.log("values:", [...scores.values()]);
console.log("entries:", [...scores.entries()]);

// 4) 与普通对象的互转
const obj = Object.fromEntries(scores); // Map -> 对象
console.log("fromEntries:", obj);
const back = new Map(Object.entries(obj)); // 对象 -> Map
console.log("back size:", back.size);

// 5) 普通对象的坑：键会被转成字符串，且有原型链继承的键
const plain = {};
plain[1] = "a";
console.log("普通对象数字键被转成字符串:", Object.keys(plain)); // ['1']
console.log('"toString" in {} ?', "toString" in {}); // true，来自原型，容易误判

export { scores };
