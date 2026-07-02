// 文件：code/ch13/09-assertion.ts
// 类型断言 as：谨慎使用。

// 场景：你比 TS 更清楚某个值的类型。
// 典型例子是 DOM / JSON 解析，返回值类型很宽（这里用模拟）。
const raw: unknown = JSON.parse('{"port": 8080}');

// 用 as 告诉编译器"我知道它是这个形状"。
const parsed = raw as { port: number };
console.log("端口：", parsed.port);

// ⚠️ 断言不做任何运行时检查！它只是"你对编译器的承诺"。
// 如果承诺错了，运行时照样出问题（下面这段故意注释掉，避免程序崩溃）：
// const wrong = "not a number" as unknown as number;
// console.log(wrong.toFixed(2)); // 运行时报错：wrong.toFixed is not a function
console.log("断言只影响编译期，不改变运行时的值，用错了运行时照样炸。");

export {};
