// 文件：code/ch09/str-kit/index.js
// 包的入口文件（entry point）。它把 src 里的实现「再导出」出去，
// 这样使用者只需要 import "str-kit" 就能拿到全部工具。

// 再导出（re-export）：把 strings.js 的所有命名导出原样转发出去。
export * from "./src/strings.js";

// 也可以顺便提供一个「聚合默认导出」，方便一次性拿到所有函数。
import { capitalize, slugify, truncate } from "./src/strings.js";
export default { capitalize, slugify, truncate };
