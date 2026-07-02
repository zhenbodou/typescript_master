// 文件：code/ch05/03-constructor-new.js
// 构造函数 + new，以及 new 到底做了什么

// 约定：构造函数首字母大写
function User(name, age) {
  // new 会自动创建一个空对象并绑定给 this，我们只需往 this 上挂属性
  this.name = name;
  this.age = age;
}

// 把"共享方法"挂到 User.prototype 上，所有实例共享同一个函数
User.prototype.greet = function () {
  return `你好，我叫 ${this.name}，今年 ${this.age} 岁。`;
};

const alice = new User("Alice", 30);
const bob = new User("Bob", 25);

console.log(alice.greet()); // 你好，我叫 Alice，今年 30 岁。
console.log(bob.greet()); // 你好，我叫 Bob，今年 25 岁。

// 关键：这次 greet 是共享的同一个函数了！
console.log("共享同一个 greet？", alice.greet === bob.greet); // true

// 实例的原型就是构造函数的 prototype
console.log(Object.getPrototypeOf(alice) === User.prototype); // true

// constructor 指回构造函数
console.log(alice.constructor === User); // true

// ---- 手写 myNew，看清 new 的四步 ----
function myNew(Constructor, ...args) {
  // 第 1 步：创建一个新对象，它的原型指向 Constructor.prototype
  const obj = Object.create(Constructor.prototype);
  // 第 2 步：以该对象为 this 调用构造函数
  const result = Constructor.apply(obj, args);
  // 第 3 步：如果构造函数返回了一个对象，就用它；否则用我们创建的 obj
  // 第 4 步：返回该对象
  return typeof result === "object" && result !== null ? result : obj;
}

const carol = myNew(User, "Carol", 40);
console.log(carol.greet()); // 你好，我叫 Carol，今年 40 岁。
console.log(carol instanceof User); // true

export { User, myNew };
