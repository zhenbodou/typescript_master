// 文件：code/ch26/app/src/server.ts
// 应用入口：加载配置 → 创建 app → 监听端口 → 优雅关闭（graceful shutdown）。
// 运行：npx tsx src/server.ts   （需先 npm install）

import { loadConfig } from "./config/config.js";
import { createApp } from "./http/app.js";

const config = loadConfig(); // 非法配置会在这里「快速失败」
const { app, repo } = createApp({ dbFile: config.dbFile });

const server = app.listen(config.port, () => {
  console.log(`✅ 任务 API 已启动：http://localhost:${config.port}`);
  console.log(`   环境：${config.nodeEnv}  数据库：${config.dbFile}`);
  console.log(`   健康检查：curl http://localhost:${config.port}/health`);
});

/** 优雅关闭：收到终止信号时，先停收新请求，再关数据库连接，最后退出。 */
function shutdown(signal: string) {
  console.log(`\n收到 ${signal}，正在关闭…`);
  server.close(() => {
    repo.close();
    console.log("已关闭数据库连接，再见 👋");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // kill / 容器停止
