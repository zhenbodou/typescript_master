// 文件：code/ch16/01-why-generics.ts
// 演示「不用泛型」的三种糟糕做法，以及泛型如何一次性解决问题。

// 做法一：为每种类型各写一份，啰嗦且无法穷尽。
function firstNumber(arr: number[]): number | undefined {
  return arr[0];
}
function firstString(arr: string[]): string | undefined {
  return arr[0];
}

// 做法二：用 any，虽然「通用」了，但丢掉了全部类型信息。
function firstAny(arr: any[]): any {
  return arr[0];
}

// 做法三：泛型。类型参数 T 像一个「占位符」，在调用时才被填上。
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const a = firstNumber([1, 2, 3]); // number | undefined
const b = firstString(["x", "y"]); // string | undefined

const bad = firstAny([1, 2, 3]); // 类型是 any，下面这行不会报编译错误（危险！）
try {
  bad.toUpperCase(); // 编译通过，但 bad 其实是 number，运行时才炸
} catch (e) {
  console.log("any 埋下的雷在运行时爆炸:", (e as Error).message);
}

const n = first([1, 2, 3]); // T 被推断为 number，n: number | undefined
const s = first(["hello", "world"]); // T 被推断为 string，s: string | undefined

console.log("firstNumber:", a);
console.log("firstString:", b);
console.log("first(number[]):", n);
console.log("first(string[]):", s);

// 下面这行如果取消注释会报编译错误：n 可能是 number | undefined，且不是 string
// n?.toUpperCase();

export {};
