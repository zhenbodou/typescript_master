// 文件：code/ch04/05-this.js
// 运行方式：node 05-this.js
// 主题：this 的四种绑定规则 —— this 取决于"怎么调用"，而非"在哪定义"

// ============ 规则 1：默认绑定 ============
// 普通函数直接调用，this 指向全局对象；严格模式 / ES 模块下是 undefined。
// 本文件是 ES 模块（.js + package.json 里 "type": "module"），处于严格模式，
// 所以下面几种"有明确调用者"的例子更能说明问题。

// ============ 规则 2：隐式绑定 ============
// 谁在"点"号左边调用，this 就是谁
const person = {
  name: "小明",
  greet() {
    return `你好，我是 ${this.name}`;
  },
};
console.log(person.greet()); // 你好，我是 小明（this = person）

// ⚠️ 陷阱：把方法"摘"出来单独调用，就丢了隐式绑定
const g = person.greet;
try {
  console.log(g()); // this 不再是 person，this.name 变成 undefined
} catch (e) {
  console.log("摘出来调用出问题：", e.constructor.name);
}

// ============ 规则 3：显式绑定 call / apply / bind ============
function introduce(city, job) {
  return `${this.name} 来自 ${city}，职业是 ${job}`;
}
const user = { name: "小红" };

// call：参数一个一个传
console.log(introduce.call(user, "北京", "工程师"));
// apply：参数用数组传
console.log(introduce.apply(user, ["上海", "设计师"]));
// bind：不立即调用，返回一个"永久绑定了 this"的新函数
const boundIntro = introduce.bind(user);
console.log(boundIntro("广州", "老师"));

// ============ 规则 4：new 绑定 ============
// new 会创建一个新对象，并把它作为 this
function Animal(type) {
  this.type = type; // this 指向 new 出来的新对象
}
const cat = new Animal("猫");
console.log(cat.type); // 猫

// ============ 箭头函数：没有自己的 this，继承外层 ============
const team = {
  title: "前端组",
  members: ["A", "B", "C"],
  // ❌ 普通函数作为回调，this 会丢
  listWrong() {
    return this.members.map(function (m) {
      // 这里的 this 不是 team（严格模式 / ES 模块下 this 是 undefined）
      return `${this && this.title}-${m}`;
    });
  },
  // ✅ 箭头函数继承 listRight 里的 this（即 team）
  listRight() {
    return this.members.map((m) => `${this.title}-${m}`);
  },
};
console.log("普通函数回调：", team.listWrong()); // title 变 undefined
console.log("箭头函数回调：", team.listRight()); // 正确：前端组-A ...

// 📌 一句话记忆：
// - 普通函数的 this = "调用时" 点号左边是谁 / call 传谁 / new 谁。
// - 箭头函数的 this = "定义时" 外层作用域的 this，且无法被改变。
