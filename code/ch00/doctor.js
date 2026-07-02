// 文件：code/ch00/doctor.js
// 运行方式：node doctor.js

// process 是 Node.js 提供的全局对象，代表"当前运行的这个进程"，
// 里面藏着版本、平台、工作目录等信息。
const nodeVersion = process.version; // 例如 "v20.11.0"
const platform = process.platform; // "darwin"(mac) / "win32" / "linux"
const arch = process.arch; // CPU 架构，如 "arm64" / "x64"
const cwd = process.cwd(); // current working directory，当前所在目录

// 生成一个"年-月-日 时:分:秒"格式的时间字符串。
// new Date() 拿到当前时间，后面这些方法把它拆成各部分。
const now = new Date();
const pad = (n) => String(n).padStart(2, "0"); // 个位数前面补 0，如 5 -> "05"
const timestamp =
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
  `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

// 开始打印报告。
console.log("==============================");
console.log("  环境自检 Environment Doctor");
console.log("==============================");
console.log("Node.js 版本 :", nodeVersion);
console.log("操作系统     :", `${platform} (${arch})`);
console.log("当前工作目录 :", cwd);
console.log("运行时间     :", timestamp);

// 简单校验：主版本号是否 >= 18（本书示例的推荐下限）。
// nodeVersion 形如 "v20.11.0"，slice(1) 去掉开头的 "v"，
// split(".") 按点切成 ["20","11","0"]，取第 0 个并转成数字。
const majorVersion = Number(nodeVersion.slice(1).split(".")[0]);

if (majorVersion >= 18) {
  console.log("✅ 恭喜，你的环境已经可以开始学习了！");
} else {
  console.log("⚠️ 你的 Node 版本偏低，建议升级到 LTS（18 及以上）。");
}
