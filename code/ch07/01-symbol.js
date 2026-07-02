// 文件：code/ch07/01-symbol.js
// Symbol：唯一性、作为对象键、Symbol.for、知名 symbol

// 1) 每个 Symbol 都是独一无二的，哪怕描述文字一样
const a = Symbol("id");
const b = Symbol("id");
console.log("a === b ?", a === b); // false，两个不同的值
console.log("a.description =", a.description); // "id"，只是给人看的标签

// 2) 用 Symbol 作为对象的键，不会和任何字符串键冲突
const ID = Symbol("id");
const user = {
  name: "小明",
  [ID]: 1001, // 计算属性名：用变量的值作键
};
console.log("user.name =", user.name);
console.log("user[ID] =", user[ID]);

// Symbol 键不会出现在常规遍历里
console.log("Object.keys:", Object.keys(user)); // 只有 "name"
for (const k in user) console.log("for-in:", k); // 只有 "name"
// 要专门取 Symbol 键，用 Object.getOwnPropertySymbols
console.log("symbol keys:", Object.getOwnPropertySymbols(user)); // [ Symbol(id) ]

// 3) Symbol.for：在“全局 Symbol 注册表”里按字符串登记/取回，同名即同一个
const s1 = Symbol.for("app.token");
const s2 = Symbol.for("app.token");
console.log("s1 === s2 ?", s1 === s2); // true，注册表里同名返回同一个
console.log("keyFor:", Symbol.keyFor(s1)); // "app.token"

// 4) 知名 Symbol（well-known symbol）：语言内置的“协议钩子”
//    最重要的是 Symbol.iterator，我们下一节详细讲
console.log("typeof Symbol.iterator =", typeof Symbol.iterator); // "symbol"

const range = {
  from: 1,
  to: 3,
  // 自定义 Symbol.toPrimitive：控制对象被转成原始值时的行为
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return `范围 ${this.from}..${this.to}`;
    return this.to - this.from; // number / default
  },
};
console.log(`${range}`); // 触发 string hint -> "范围 1..3"
console.log(+range); // 触发 number hint -> 2
