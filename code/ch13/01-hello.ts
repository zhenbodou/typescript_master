// 文件：code/ch13/01-hello.ts
// 你的第一个 TypeScript 程序。用 npx tsx ch13/01-hello.ts 运行。

// message 的类型被显式注解为 string。
const message: string = "你好，TypeScript！";

console.log(message);

// 下面这行如果取消注释，tsx / tsc 会在「编译期」直接报错：
//   Type 'number' is not assignable to type 'string'.
// const wrong: string = 123;

export {};
