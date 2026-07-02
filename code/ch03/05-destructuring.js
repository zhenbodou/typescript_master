// 文件：code/ch03/05-destructuring.js
// 运行方式：node 05-destructuring.js
// 主题：解构赋值（destructuring）

// 1) 数组解构：按位置取值
const point = [10, 20, 30];
const [x, y, z] = point;
console.log("数组解构：", x, y, z); // 10 20 30

// 跳过某些元素（用逗号占位）
const [first, , third] = point;
console.log("跳过中间：", first, third); // 10 30

// 剩余元素用 ...rest 收集成数组
const [head, ...tail] = [1, 2, 3, 4];
console.log("head：", head, "tail：", tail); // 1 [2,3,4]

// 交换变量（不需要临时变量）
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log("交换后：", a, b); // 2 1

// 2) 对象解构：按属性名取值
const user = { name: "小明", age: 18, city: "北京" };
const { name, age } = user;
console.log("对象解构：", name, age); // 小明 18

// 重命名：把 name 取出来但改叫 userName
const { name: userName } = user;
console.log("重命名：", userName); // 小明

// 默认值：属性不存在时使用
const { gender = "未知" } = user;
console.log("默认值：", gender); // 未知

// 重命名 + 默认值一起用
const { role: userRole = "普通用户" } = user;
console.log("重命名+默认值：", userRole); // 普通用户

// 3) 嵌套解构
const order = {
  id: 1001,
  customer: { name: "小红", address: { city: "上海" } },
};
const {
  customer: {
    name: customerName,
    address: { city },
  },
} = order;
console.log("嵌套解构：", customerName, city); // 小红 上海

// 4) 函数参数解构（非常常用）
// 传一个"配置对象"，在参数位置直接解构出需要的字段并给默认值
function createUser({ name, age = 0, vip = false } = {}) {
  return `${name}, ${age}岁, ${vip ? "VIP" : "普通"}`;
}
console.log(createUser({ name: "小李", age: 25, vip: true }));
console.log(createUser({ name: "小王" })); // age、vip 用默认值
console.log(createUser()); // 连参数都没传，靠末尾的 = {} 兜底

// 数组参数解构
function distance([x1, y1], [x2, y2]) {
  return Math.hypot(x2 - x1, y2 - y1);
}
console.log("两点距离：", distance([0, 0], [3, 4])); // 5

// 5) 解构常配合遍历
const scores = { 语文: 90, 数学: 85, 英语: 88 };
for (const [subject, score] of Object.entries(scores)) {
  console.log(`${subject}: ${score}`);
}
