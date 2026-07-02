// 文件：code/ch03/06-reference.js
// 运行方式：node 06-reference.js
// 主题：引用类型 vs 值类型、浅拷贝 vs 深拷贝、对象比较的坑

// 1) 值类型：= 赋的是"值本身"的副本
let n1 = 10;
let n2 = n1; // 复制了一份值
n2 = 20;
console.log("值类型：", n1, n2); // 10 20（互不影响）

// 2) 引用类型：= 赋的是"引用"（同一个对象的地址）
const obj1 = { count: 1 };
const obj2 = obj1; // obj2 和 obj1 指向同一个对象
obj2.count = 999;
console.log("引用类型：", obj1.count, obj2.count); // 999 999（一起变了！）
console.log("是同一个对象吗：", obj1 === obj2); // true

// 数组同理
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log("数组引用：", arr1); // [1,2,3,4]

// 3) 浅拷贝（shallow copy）：只复制第一层
const source = { name: "小明", hobbies: ["篮球"] };
const shallow = { ...source }; // 或 Object.assign({}, source)
shallow.name = "小红"; // 第一层是独立的，改了不影响原对象
console.log("浅拷贝改第一层：", source.name, shallow.name); // 小明 小红
shallow.hobbies.push("足球"); // ⚠️ 但内层数组仍是共享的引用！
console.log("浅拷贝改内层：", source.hobbies); // ["篮球","足球"] 也被改了！

// 4) 深拷贝（deep copy）：连内层一起复制，用 structuredClone
const source2 = { name: "小明", hobbies: ["篮球"] };
const deep = structuredClone(source2); // 现代 Node/浏览器内置
deep.hobbies.push("足球");
console.log("深拷贝改内层：", source2.hobbies, deep.hobbies); // ["篮球"] ["篮球","足球"]

// 5) 对象比较的坑：=== 比较的是"是不是同一个对象"，不是内容
const p1 = { x: 1 };
const p2 = { x: 1 };
console.log("内容相同但不是同一个：", p1 === p2); // false！
console.log("和自己比：", p1 === p1); // true
// 想比较内容，一种简易办法是转成 JSON 字符串再比（有局限，第 6 章细说）
console.log("按内容比：", JSON.stringify(p1) === JSON.stringify(p2)); // true

// 6) 函数传参也是"传引用"
function addTag(o) {
  o.tag = "已处理"; // 直接改会影响外部对象
}
const data = { id: 1 };
addTag(data);
console.log("函数改了外部对象：", data); // { id:1, tag:"已处理" }
