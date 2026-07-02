// 文件：code/ch13/04-inference.ts
// 类型推断（type inference）：能推断就别写。

// 没写类型，但 TS 通过右边的值推断出 count 是 number。
let count = 0;
count = 10; // OK
// count = "十"; // ❌ 报错：不能把 string 赋给 number

// 推断出 title 是 string。
const title = "TypeScript";
console.log(title.toUpperCase());

// 数组字面量也能推断：这是 number[]。
const nums = [1, 2, 3];
// nums.push("4"); // ❌ 报错：number[] 里不能放 string

// 函数返回值也能推断：TS 知道 double 返回 number。
function double(x: number) {
  return x * 2;
}
const result = double(21); // result 被推断为 number
console.log("result =", result);

// —— 何时必须显式注解？——
// 1) 函数参数：TS 无从推断调用者会传什么，必须自己写。
// 2) 先声明、后赋值的变量：
let later: string;
later = "稍后赋值";
console.log(later);

// 3) 你希望类型比推断结果更宽或更窄时（后面章节会遇到）。

export {};
