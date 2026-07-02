// 文件：code/ch03/04-object.js
// 运行方式：node 04-object.js
// 主题：对象基础

// 1) 字面量创建对象
const user = {
  name: "小明",
  age: 18,
  isStudent: true,
};

// 2) 读属性：点语法 vs 方括号语法
console.log("点语法：", user.name); // "小明"
console.log("方括号：", user["age"]); // 18
const key = "isStudent";
console.log("动态 key 只能用方括号：", user[key]); // true

// 3) 写 / 增 / 删 属性
user.age = 19; // 修改
user.city = "北京"; // 新增（对象是可变的）
delete user.isStudent; // 删除
console.log("改动后：", user); // { name: "小明", age: 19, city: "北京" }

// 4) 嵌套对象
const order = {
  id: 1001,
  customer: { name: "小红", vip: true },
  items: ["书", "笔"],
};
console.log("嵌套读取：", order.customer.name); // "小红"
console.log("对象里的数组：", order.items[0]); // "书"

// 5) 方法：值是函数的属性。this 指向"点前面的那个对象"
const counter = {
  count: 0,
  increment() {
    this.count += 1; // this 指向 counter
    return this.count;
  },
};
console.log("方法调用：", counter.increment()); // 1
console.log("再调用：", counter.increment()); // 2

// 6) 简写属性（shorthand）：变量名和属性名相同时可省略
const title = "待办";
const done = false;
const todo = { title, done }; // 等价于 { title: title, done: done }
console.log("简写属性：", todo); // { title: "待办", done: false }

// 7) 计算属性名（computed property name）：用变量的值当属性名
const field = "score";
const record = {
  name: "小明",
  [field]: 95, // 属性名是 field 的值 "score"
  [`${field}_max`]: 100,
};
console.log("计算属性名：", record); // { name:"小明", score:95, score_max:100 }

// 8) Object.keys / values / entries
const p = { a: 1, b: 2, c: 3 };
console.log("keys：", Object.keys(p)); // ["a","b","c"]
console.log("values：", Object.values(p)); // [1,2,3]
console.log("entries：", Object.entries(p)); // [["a",1],["b",2],["c",3]]
// entries 常配合遍历使用
for (const [k, v] of Object.entries(p)) {
  console.log(`  ${k} = ${v}`);
}

// 9) Object.assign 与展开 {...obj}：合并对象
const defaults = { theme: "light", fontSize: 14 };
const custom = { fontSize: 16 };
const merged1 = Object.assign({}, defaults, custom); // 后面覆盖前面
const merged2 = { ...defaults, ...custom }; // 更常用的写法
console.log("assign 合并：", merged1); // { theme:"light", fontSize:16 }
console.log("展开合并：", merged2); // { theme:"light", fontSize:16 }
// 展开也能用来"改一个字段生成新对象"（不改原对象）
const updated = { ...defaults, theme: "dark" };
console.log("生成新对象：", updated, "原对象没变：", defaults);
