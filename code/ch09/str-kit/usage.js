// 文件：code/ch09/str-kit/usage.js
// 演示如何「像使用者一样」导入并使用 str-kit。
// 运行：node usage.js

// 因为 usage.js 就在包内部，这里用相对路径 "./index.js" 指向入口。
// 如果这个包已经发布到 npm、并被别的项目安装，
// 别人会写成 import { capitalize } from "str-kit";（下面注释里有说明）
import strKit, { capitalize, slugify, truncate } from "./index.js";

console.log("capitalize('hello world') =>", capitalize("hello world"));
console.log("slugify('Hello World! 你好') =>", slugify("Hello World! 你好"));
console.log("truncate('这是一段很长很长的文字', 6) =>", truncate("这是一段很长很长的文字", 6));

// 默认导出是一个聚合对象，适合一次性拿到全部工具。
console.log("默认导出对象包含：", Object.keys(strKit));

// 如果这个包被别人 npm install 安装后使用，代码会长这样：
//   import { capitalize } from "str-kit";
//   console.log(capitalize("hi"));
