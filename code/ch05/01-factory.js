// 文件：code/ch05/01-factory.js
// 用工厂函数创建对象，以及它的局限（方法被重复创建）

// 工厂函数：输入数据，返回一个新对象
function createUser(name, age) {
  return {
    name,
    age,
    // 每个对象都自己复制了一份 greet 方法
    greet() {
      return `你好，我叫 ${this.name}，今年 ${this.age} 岁。`;
    },
  };
}

const alice = createUser("Alice", 30);
const bob = createUser("Bob", 25);

console.log(alice.greet()); // 你好，我叫 Alice，今年 30 岁。
console.log(bob.greet()); // 你好，我叫 Bob，今年 25 岁。

// 局限：两个对象的 greet 是各自独立的函数，并非同一个
console.log("两个 greet 是同一个函数吗？", alice.greet === bob.greet); // false

// 如果创建一万个用户，就会有一万份一模一样的 greet 函数，浪费内存。
// 我们希望所有用户"共享"同一个 greet —— 这正是原型要解决的问题。

export { createUser };
