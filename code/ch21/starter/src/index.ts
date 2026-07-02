// 文件：code/ch21/starter/src/index.ts

/** 计算两数之和。 */
export function add(a: number, b: number): number {
  return a + b;
}

/** 计算两数之差。 */
export function subtract(a: number, b: number): number {
  return a - b;
}

/** 一个简单的问候函数。 */
export function greet(name: string): string {
  return `你好，${name}！`;
}

// 直接用 `node dist/index.js` 运行时的演示入口。
// 作为库被 import 时，下面这段不会打印（因为没有顶层副作用调用它）。
function main(): void {
  console.warn(greet('世界'));
  console.warn(`1 + 2 = ${add(1, 2)}`);
}

main();
