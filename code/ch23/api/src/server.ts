// 文件：code/ch23/api/src/server.ts
// 应用入口：创建 app 并监听端口。
// 运行：npx tsx src/server.ts   （需先 npm install）

import { createApp } from "./app.js";

const app = createApp();
const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`任务 API 已启动：http://localhost:${PORT}`);
  console.log(`试试：curl http://localhost:${PORT}/tasks`);
});
