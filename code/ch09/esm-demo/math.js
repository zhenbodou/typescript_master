// 文件：code/ch09/esm-demo/math.js
// 一个演示 ES Modules 导出的小模块。

// 命名导出（named export）：可以有很多个。
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 也可以先声明、最后统一导出（效果相同）。
function subtract(a, b) {
  return a - b;
}
export { subtract };

// 默认导出（default export）：每个模块最多一个。
// 这里默认导出一个「计算器」对象。
export default {
  name: "mini-calculator",
  version: "1.0.0",
};

// 模块顶层的代码只会在「第一次被导入」时执行一次。
console.log("[math.js] 模块被加载了（只会看到一次这行）");
