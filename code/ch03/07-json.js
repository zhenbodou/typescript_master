// 文件：code/ch03/07-json.js
// 运行方式：node 07-json.js
// 主题：JSON.stringify / JSON.parse 简介（第 6 章会深入）

const user = {
  name: "小明",
  age: 18,
  hobbies: ["篮球", "编程"],
  address: { city: "北京" },
};

// 1) JSON.stringify：把对象/数组变成 JSON 字符串
const json = JSON.stringify(user);
console.log("stringify：", json);
console.log("类型：", typeof json); // string

// 2) 加缩进，便于阅读（第三个参数是缩进空格数）
console.log("美化输出：");
console.log(JSON.stringify(user, null, 2));

// 3) JSON.parse：把 JSON 字符串还原成对象
const text = '{"id":1,"title":"买牛奶","done":false}';
const obj = JSON.parse(text);
console.log("parse：", obj);
console.log("访问字段：", obj.title); // 买牛奶

// 4) 一个实用场景：用 JSON 做深拷贝（简易版，有局限）
const copy = JSON.parse(JSON.stringify(user));
copy.hobbies.push("画画");
console.log("原对象没变：", user.hobbies); // ["篮球","编程"]
console.log("拷贝变了：", copy.hobbies); // ["篮球","编程","画画"]

// ⚠️ JSON 的局限：函数、undefined 会丢失，Date 会变字符串
const tricky = { fn: () => 1, u: undefined, when: new Date(0) };
console.log("有损转换：", JSON.stringify(tricky)); // {"when":"1970-01-01T00:00:00.000Z"}
