// 文件：code/ch13/02-pain.ts
// 演示「JS 动态类型的痛点」，以及 TS 如何在编译期把它挡下来。

// 想象这个函数从某个"配置"里取端口号，本意是数字相加。
function nextPort(port: number): number {
  return port + 1;
}

// 在纯 JS 里，如果不小心传进来的是字符串 "3000"（比如来自环境变量），
// port + 1 会变成字符串拼接 "30001"，而且不报错，程序继续带病运行。
// 在 TS 里，下面这行会被编译器直接拒绝：
//   Argument of type 'string' is not assignable to parameter of type 'number'.
// console.log(nextPort("3000")); // ❌ 编译期报错

// 只有传对了类型才放行：
console.log("下一个端口：", nextPort(3000)); // 3001

// 这就是 TS 的核心价值：把"运行时才会炸"的错误，提前到"你敲代码时"就发现。

export {};
