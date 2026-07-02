// 文件：code/ch04/demo.js
// 运行方式：node demo.js
// 主题：演示 mini-lodash 工具库的效果

import {
  once,
  memoize,
  partial,
  curry,
  compose,
  pipe,
  debounce,
  throttle,
} from "./mini-lodash.js";

// ===== once =====
console.log("===== once =====");
const init = once(() => {
  console.log("（真正执行了初始化）");
  return "done";
});
console.log(init()); // 打印"真正执行了初始化"，返回 done
console.log(init()); // 不再执行，直接返回 done
console.log(init()); // 同上

// ===== memoize =====
console.log("\n===== memoize =====");
const slowSquare = memoize((n) => {
  console.log(`  计算 ${n} 的平方...`);
  return n * n;
});
console.log(slowSquare(4)); // 会计算
console.log(slowSquare(4)); // 命中缓存，不再计算
console.log(slowSquare(5)); // 新参数，重新计算

// ===== partial =====
console.log("\n===== partial =====");
const greet = (greeting, name) => `${greeting}，${name}！`;
const sayHi = partial(greet, "你好");
console.log(sayHi("小明")); // 你好，小明！
console.log(sayHi("小红")); // 你好，小红！

// ===== curry =====
console.log("\n===== curry =====");
const sum3 = (a, b, c) => a + b + c;
const curriedSum = curry(sum3);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
console.log(curriedSum(1, 2, 3)); // 6

// ===== compose / pipe =====
console.log("\n===== compose / pipe =====");
const addOne = (x) => x + 1;
const timesTwo = (x) => x * 2;
// compose：先 addOne，再 timesTwo（从右往左）
console.log(compose(timesTwo, addOne)(5)); // (5+1)*2 = 12
// pipe：先 addOne，再 timesTwo（从左往右，更好读）
console.log(pipe(addOne, timesTwo)(5)); // (5+1)*2 = 12

// ===== debounce =====
console.log("\n===== debounce（100ms）=====");
const onSearch = debounce((q) => {
  console.log(`  发起搜索：${q}`);
}, 100);
// 连续触发 5 次，只有最后一次会在停止后 100ms 真正执行
onSearch("a");
onSearch("ab");
onSearch("abc");
onSearch("abcd");
onSearch("abcde"); // 只有这次生效

// ===== throttle =====
console.log("===== throttle（100ms）=====");
const onScroll = throttle(() => {
  console.log("  处理滚动，时间戳：", Date.now() % 100000);
}, 100);
onScroll(); // 立即执行一次
onScroll(); // 100ms 内，被拦截
onScroll(); // 被拦截
// 250ms 后再触发一次，验证节流放行
setTimeout(onScroll, 250); // 会执行

// 因为 debounce/throttle 涉及异步定时器，最后打一行提示
setTimeout(() => {
  console.log("\n（异步演示结束）");
}, 400);
