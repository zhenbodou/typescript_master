// 文件：code/ch11/02b-process-os.js
// 演示 process（进程信息）与 os（操作系统信息）。

import os from "node:os";

// argv：命令行参数数组
// argv[0] 是 node 可执行文件路径，argv[1] 是当前脚本路径，
// 从 argv[2] 开始才是用户传入的参数。
console.log("argv：", process.argv);
const userArgs = process.argv.slice(2);
console.log("用户参数：", userArgs);

// env：环境变量（一个对象）
console.log("当前 PATH 的前 40 个字符：", (process.env.PATH || "").slice(0, 40), "...");
console.log("自定义变量 MY_NAME：", process.env.MY_NAME ?? "(未设置)");

// cwd：当前工作目录（运行 node 命令时所在的目录，不一定是脚本目录）
console.log("cwd：", process.cwd());

// 平台与版本信息
console.log("platform：", process.platform); // 'darwin' | 'win32' | 'linux' ...
console.log("Node 版本：", process.version);

// os 模块
console.log("CPU 核心数：", os.cpus().length);
console.log("总内存(GB)：", (os.totalmem() / 1024 ** 3).toFixed(1));
console.log("空闲内存(GB)：", (os.freemem() / 1024 ** 3).toFixed(1));
console.log("os.platform()：", os.platform());
console.log("临时目录：", os.tmpdir());

// stdout / stderr：process.stdout.write 不会自动换行
process.stdout.write("这是标准输出，没有换行");
process.stdout.write("——接着上一句\n");

// exit：主动结束进程，0 表示成功，非 0 表示出错
process.exit(0);
