// 文件：code/ch11/02-path.js
// 演示 path 模块与 ESM 下如何获取"当前文件所在目录"。

import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM 里没有 __dirname / __filename，需要自己算：
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("当前文件：", __filename);
console.log("当前目录：", __dirname);

// join：把片段拼成路径，自动处理分隔符和多余的斜杠
console.log("join：", path.join(__dirname, "data", "sample.log"));

// resolve：从右往左拼，直到拼出一个绝对路径（以 cwd 为基准）
console.log("resolve：", path.resolve("data", "sample.log"));

// 拆解路径
const p = "/var/log/app/error.log";
console.log("basename：", path.basename(p)); // error.log
console.log("basename(去后缀)：", path.basename(p, ".log")); // error
console.log("dirname：", path.dirname(p)); // /var/log/app
console.log("extname：", path.extname(p)); // .log

// parse 一次性拿到所有部分
console.log("parse：", path.parse(p));

// 跨平台分隔符（当前系统）
console.log("path.sep：", JSON.stringify(path.sep));
