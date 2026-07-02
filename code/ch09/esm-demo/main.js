// 文件：code/ch09/esm-demo/main.js
// 演示各种 import 写法。用 `node main.js` 运行。

// 1) 按名字导入命名导出（大括号里的名字必须和导出的一致）。
import { add, multiply, PI } from "./math.js";

// 2) 默认导出用任意名字接收，不加大括号。
import calculator from "./math.js";

// 3) 导入时重命名，避免和本地变量冲突。
import { subtract as minus } from "./math.js";

// 4) 用命名空间对象一次性拿到所有命名导出。
import * as mathNS from "./math.js";

console.log("add(2, 3) =", add(2, 3));
console.log("multiply(4, 5) =", multiply(4, 5));
console.log("PI =", PI);
console.log("minus(10, 4) =", minus(10, 4));
console.log("默认导出：", calculator.name, calculator.version);
console.log("命名空间 mathNS.PI =", mathNS.PI);
console.log("命名空间里的默认导出 mathNS.default.name =", mathNS.default.name);

// 5) 再次导入同一个模块，不会重新执行 math.js 的顶层代码（单例缓存）。
const again = await import("./math.js"); // 动态 import()，返回一个 Promise
console.log("动态导入拿到 add：", again.add(1, 1));
console.log("（注意：上面没有再次打印 [math.js] 模块被加载了）");
