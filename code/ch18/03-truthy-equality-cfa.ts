// 文件：code/ch18/03-truthy-equality-cfa.ts

// ---------- 1) 真值收窄（truthiness narrowing） ----------
// 一个值可能是 string，也可能是 null / undefined。
function greet(name: string | null | undefined): string {
  // if (name) 会同时排除 null、undefined 以及空字符串 ""
  if (name) {
    return `你好, ${name.toUpperCase()}`; // name: string
  }
  return "你好, 陌生人";
}

// ⚠️ 真值收窄的陷阱：0、""、NaN 也是「假值」，会被一起排除
function lengthOf(list: string[] | null): number {
  if (list) {
    return list.length; // list: string[]
  }
  return 0;
}

// ---------- 2) 相等收窄（equality narrowing） ----------
// 通过 === / !== 比较两个联合类型的变量，TS 会收窄「交集」类型。
function compare(a: string | number, b: string | boolean): void {
  if (a === b) {
    // 只有当两者相等时才可能进入——此时公共类型只能是 string
    console.log(a.toUpperCase(), b.toUpperCase()); // a、b 都是 string
  }
}

// 用 != null 一次排除 null 和 undefined（== / != 对 null 会同时匹配 undefined）
function trim(s: string | null | undefined): string {
  if (s != null) {
    return s.trim(); // s: string
  }
  return "";
}

// ---------- 3) 控制流分析（control flow analysis, CFA） ----------
// TS 会像跟踪程序执行一样，逐行推算每个位置变量的类型。
function cfa(input: string | number): string {
  let out: string;
  if (typeof input === "string") {
    out = input; // 这里 input: string
  } else {
    out = input.toFixed(2); // 这里 input: number
  }
  // 两个分支都给 out 赋了 string，合流之后 out: string
  return out;
}

// 提前 return 也会影响后续类型：这叫「收窄的持续生效」
function afterReturn(x: string | null): string {
  if (x === null) {
    return "空";
  }
  // 上面 null 分支已经 return，走到这里 x 只可能是 string
  return x.toLowerCase(); // x: string
}

console.log(greet("Alice"), greet(null), greet(""));
console.log(lengthOf(["a", "b"]), lengthOf(null));
compare("hello", "hello");
console.log(trim("  hi  "), trim(null));
console.log(cfa("abc"), cfa(3.14159));
console.log(afterReturn("MixedCase"), afterReturn(null));
