// 文件：code/ch13/03-basic-types.ts
// 基础类型注解一览：number / string / boolean / null / undefined / 数组 / 元组。

// —— 原始类型 ——
const age: number = 30;
const name: string = "小明";
const isAdmin: boolean = false;
const nothing: null = null;
const notAssigned: undefined = undefined;

console.log(age, name, isAdmin, nothing, notAssigned);

// —— 数组：两种等价写法 ——
const scores: number[] = [90, 85, 100];
const words: Array<string> = ["a", "b", "c"];

console.log("scores 之和：", scores.reduce((a, b) => a + b, 0));
console.log("words：", words.join(","));

// —— 元组（tuple）：定长、每个位置类型固定 ——
// 第 0 位必须是 string，第 1 位必须是 number。
const person: [string, number] = ["小红", 25];
console.log("姓名：", person[0], "年龄：", person[1]);

// person[0] 被 TS 记住是 string，所以可以直接用字符串方法：
console.log("名字长度：", person[0].length);

// 下面几行如果取消注释都会报错，正是元组的价值：
// const bad1: [string, number] = [25, "小红"]; // ❌ 顺序反了
// const bad2: [string, number] = ["小红"];      // ❌ 少了一个

export {};
