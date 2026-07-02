// 文件：code/ch07/03-generator.js
// 生成器（generator）：function*、yield、yield*、惰性、无限序列、双向通信

// 1) 最简单的生成器
function* greet() {
  yield "你好";
  yield "世界";
  return "结束"; // return 的值作为最后一次 next 的 value，且 done:true
}

const g = greet();
console.log(g.next()); // { value: '你好', done: false }
console.log(g.next()); // { value: '世界', done: false }
console.log(g.next()); // { value: '结束', done: true }
console.log(g.next()); // { value: undefined, done: true }

// 2) 生成器天生可迭代：可以直接 for...of / 扩展
function* rangeGen(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}
console.log("for...of:", [...rangeGen(1, 5)]); // [1,2,3,4,5]

// 3) yield* 委托：把迭代“转交”给另一个可迭代对象/生成器
function* abc() {
  yield "a";
  yield "b";
}
function* combined() {
  yield 1;
  yield* abc(); // 展开 abc 的所有 yield
  yield* [8, 9]; // 数组也可迭代，同样能委托
  yield 2;
}
console.log("yield*:", [...combined()]); // [1,'a','b',8,9,2]

// 4) 惰性求值 + 无限序列：只在需要时才算下一个
function* naturals() {
  let n = 1;
  while (true) {
    yield n++; // 无限，但不会死循环——每次 next 只走一步
  }
}
function take(iterable, count) {
  const out = [];
  for (const x of iterable) {
    if (out.length >= count) break; // 拿够就停，惰性体现在这里
    out.push(x);
  }
  return out;
}
console.log("前 5 个自然数:", take(naturals(), 5)); // [1,2,3,4,5]

// 5) 双向通信：next(value) 把值“送回”给上一个 yield 表达式
function* calculator() {
  const x = yield "请给我第一个数"; // 第一次 next() 停在这里，x 由第二次 next(v) 提供
  const y = yield "请给我第二个数";
  return x + y;
}
const c = calculator();
console.log(c.next().value); // "请给我第一个数"（启动，忽略传入值）
console.log(c.next(10).value); // 把 10 赋给 x，返回 "请给我第二个数"
console.log(c.next(5).value); // 把 5 赋给 y，返回 15

export { rangeGen, naturals, take };
