// 文件：code/ch07/02-iterable.js
// 可迭代协议（iterable）与迭代器协议（iterator）：手写一个可迭代对象

// —— 先手动“开一个迭代器”，看清底层发生了什么 ——
const arr = ["a", "b"];
const it = arr[Symbol.iterator](); // 数组内置了 Symbol.iterator，调用它拿到迭代器
console.log(it.next()); // { value: 'a', done: false }
console.log(it.next()); // { value: 'b', done: false }
console.log(it.next()); // { value: undefined, done: true }

// —— 手写一个可迭代对象：一个数字区间 [from, to] ——
const range = {
  from: 1,
  to: 5,
  // 实现 iterable 协议：提供一个 [Symbol.iterator]() 方法
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    // 返回一个迭代器对象：实现 iterator 协议——有 next()，返回 {value, done}
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

// 一旦对象可迭代，下面这些语法“免费”获得支持：
console.log("for...of:");
for (const n of range) process.stdout.write(n + " ");
console.log();

console.log("扩展运算符:", [...range]); // [1,2,3,4,5]

const [first, second] = range; // 解构也走迭代协议
console.log("解构:", first, second); // 1 2

console.log("Array.from:", Array.from(range)); // [1,2,3,4,5]

// 迭代器本身也可以“既是迭代器又是可迭代对象”，让它能被 for...of 直接用
const selfIterable = {
  data: [10, 20, 30],
  i: 0,
  next() {
    return this.i < this.data.length
      ? { value: this.data[this.i++], done: false }
      : { value: undefined, done: true };
  },
  [Symbol.iterator]() {
    return this; // 返回自己
  },
};
console.log("self-iterable:", [...selfIterable]); // [10,20,30]

export { range };
