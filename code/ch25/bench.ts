// 文件：code/ch25/bench.ts
// 性能计时与"先测量再优化"演示。
// 运行：npx tsx ch25/bench.ts

import { performance } from "node:perf_hooks";

// ---------------------------------------------------------------------------
// 工具：把一段函数跑 rounds 次，返回耗时（毫秒）。
// ---------------------------------------------------------------------------
function timeit(label: string, fn: () => void, rounds = 1): number {
  // warm-up：先空跑一次，避免第一次运行的即时编译（JIT）预热影响读数。
  fn();
  const start = performance.now();
  for (let i = 0; i < rounds; i++) fn();
  const elapsed = performance.now() - start;
  console.log(`${label.padEnd(28)} ${elapsed.toFixed(3)} ms  (${rounds} 次)`);
  return elapsed;
}

// ---------------------------------------------------------------------------
// 演示 1：循环里重复计算 vs. 提到循环外。
// ---------------------------------------------------------------------------
const data = Array.from({ length: 50_000 }, (_, i) => i);

// ⚠️ 一个"昂贵"的配置对象，重复构造它没有意义（每次结果都一样）。
function buildConfig(): { factor: number } {
  let acc = 0;
  for (let k = 0; k < 200; k++) acc += Math.sqrt(k); // 假装是一次昂贵的初始化。
  return { factor: 1 + (acc % 1) * 0 }; // 结果恒为 { factor: 1 }。
}

function sumBad(): number {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    // ⚠️ 每一轮都重新构造同一个 config——重复计算，纯属浪费。
    const config = buildConfig();
    total += data[i] * config.factor;
  }
  return total;
}

function sumGood(): number {
  let total = 0;
  const len = data.length; // 长度提到循环外。
  const config = buildConfig(); // 只构造一次，提到循环外。
  for (let i = 0; i < len; i++) {
    total += data[i] * config.factor;
  }
  return total;
}

console.log("=== 演示 1：循环里的重复工作 ===");
timeit("sumBad", sumBad, 2000);
timeit("sumGood", sumGood, 2000);

// ---------------------------------------------------------------------------
// 演示 2：O(n^2) vs O(n)——用 Set 把"是否存在"从线性查找变成常数查找。
// ---------------------------------------------------------------------------
const haystack = Array.from({ length: 5000 }, (_, i) => i);
const needles = Array.from({ length: 5000 }, (_, i) => i * 2);

function countHitsQuadratic(): number {
  let hits = 0;
  for (const n of needles) {
    if (haystack.includes(n)) hits++; // includes 是 O(n)，套在循环里就是 O(n^2)。
  }
  return hits;
}

function countHitsLinear(): number {
  const set = new Set(haystack); // 一次性建索引，O(n)。
  let hits = 0;
  for (const n of needles) {
    if (set.has(n)) hits++; // has 是 O(1)。
  }
  return hits;
}

console.log("\n=== 演示 2：O(n^2) vs O(n) ===");
timeit("countHitsQuadratic", countHitsQuadratic, 20);
timeit("countHitsLinear", countHitsLinear, 20);

// ---------------------------------------------------------------------------
// 演示 3：memoize（记忆化）——把纯函数的结果缓存起来。
// ---------------------------------------------------------------------------
function memoize<A, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new Map<A, R>();
  return (arg: A): R => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// 一个"故意慢"的斐波那契（指数级递归），用来放大缓存的效果。
function slowFib(n: number): number {
  if (n < 2) return n;
  return slowFib(n - 1) + slowFib(n - 2);
}

const fastFib = memoize(slowFib);

console.log("\n=== 演示 3：memoize ===");
timeit("slowFib(32) 第一次", () => slowFib(32), 1);
timeit("fastFib(32) 第一次", () => fastFib(32), 1);
timeit("fastFib(32) 第二次(命中缓存)", () => fastFib(32), 1);

// ---------------------------------------------------------------------------
// 演示 4：console.time / console.timeEnd —— 最省事的临时计时。
// ---------------------------------------------------------------------------
console.log("\n=== 演示 4：console.time ===");
console.time("build-big-string");
let s = "";
for (let i = 0; i < 100_000; i++) s += "x";
console.timeEnd("build-big-string"); // 打印 build-big-string: X ms

console.log("\n完成。记住：先测量，再优化。");
