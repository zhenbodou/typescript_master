// 文件：code/ch13/05-functions.ts
// 函数类型：参数注解、返回值、可选参数、默认参数、rest、void、函数类型表达式。

// 参数与返回值都注解。
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(2, 3));

// 可选参数用 ?，它的类型其实是 string | undefined。
function greet(name: string, title?: string): string {
  // 因为 title 可能是 undefined，这里要判断。
  return title ? `${title} ${name}` : `你好，${name}`;
}
console.log(greet("小明"));
console.log(greet("小明", "王老师"));

// 默认参数：不用写 ?，TS 从默认值推断类型为 number。
function power(base: number, exp = 2): number {
  return base ** exp;
}
console.log(power(5)); // 25
console.log(power(2, 10)); // 1024

// rest 参数：类型是数组。
function sum(...values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// void：表示"不返回有意义的值"（只做副作用）。
function log(msg: string): void {
  console.log("[log]", msg);
}
log("这是一条日志");

// 函数类型表达式：把"函数的形状"作为一种类型。
// BinaryOp 表示"接受两个 number、返回 number"的函数。
type BinaryOp = (a: number, b: number) => number;

const multiply: BinaryOp = (a, b) => a * b; // 参数类型可省略，由 BinaryOp 推断出
console.log(multiply(6, 7)); // 42

export {};
