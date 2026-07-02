// 文件：code/ch12/08-practical.js
// 运行：node code/ch12/08-practical.js
// 本文件演示：几个"够用就好"的实用正则。⚠️ 邮箱/URL 的完整规范极复杂，
// 这里的目标是"日常表单校验够用"，不是"100% 符合 RFC"。

// 邮箱（简化版）：用户名@域名.后缀
const emailRe = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/;
console.log("邮箱:", emailRe.test("a.b+tag@mail.example.com"), emailRe.test("bad@@x"));

// URL（简化版）：http(s):// 开头
const urlRe = /^https?:\/\/[\w.-]+(:\d+)?(\/[^\s]*)?$/i;
console.log("URL:", urlRe.test("https://example.com/path?q=1"), urlRe.test("ftp://x"));

// 中国大陆手机号：1 开头，第二位 3-9，共 11 位
const phoneRe = /^1[3-9]\d{9}$/;
console.log("手机号:", phoneRe.test("13812345678"), phoneRe.test("12345"));

// 去除多余空白：把连续空白压成一个空格，并去掉首尾
const messy = "  多个   空格   和\t制表符  ";
console.log("去空白:", JSON.stringify(messy.replace(/\s+/g, " ").trim()));

// 提取所有数字（含小数）
const text = "苹果 3.5 元，香蕉 12 元，一共 15.5";
console.log("提取数字:", text.match(/\d+(\.\d+)?/g)); // ['3.5','12','15.5']

// 💡 提醒：像 HTML、JSON、CSV 这类"有嵌套/有转义"的格式，别用正则硬解析，
// 请用成熟的解析库（parser）。正则适合"局部、扁平、规则简单"的文本。
