// 文件：code/ch24/api/scripts/demo-config.ts
// 演示：从 .env 文件 + 环境变量读取类型化配置。
// 运行：npx tsx scripts/demo-config.ts
//   或：PORT=8080 npx tsx scripts/demo-config.ts
//
// process.loadEnvFile 是 Node 20.12+ / 22+ 内置的功能，
// 作用等价于社区库 dotenv：把 .env 文件里的 KEY=VALUE 灌进 process.env。
// 好处是【零依赖】。

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../src/config/config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(here, "../.env");

// 如果存在 .env 就加载；不存在也不报错（生产环境往往直接用真实环境变量）。
try {
  process.loadEnvFile(envFile);
  console.log("已加载 .env：", envFile);
} catch {
  console.log("没有 .env 文件，仅使用当前环境变量。");
}

// 真正命令行传入的环境变量（PORT=8080 npx tsx ...）会覆盖 .env 里的同名项，
// 因为 loadEnvFile 不覆盖已存在的 process.env（与 dotenv 行为一致）。
const config = loadConfig();
console.log("最终配置：", config);
