# 第 26 章 · 全栈任务管理器

全书收官项目：一个 TypeScript + Node 的任务管理应用，由两部分组成——

- **后端 REST API**：Express + TypeScript，任务 CRUD，`node:sqlite` 持久化，分层架构（domain / repository / service / http），请求校验、统一错误处理、类型化配置、健康检查、优雅关闭。
- **CLI 客户端**：命令行工具，用 `fetch` 调用后端，支持 `add / list / done / rm` 子命令，带彩色输出与友好的错误处理。

> 本机环境：Node **v24**（`node:sqlite` 可直接使用，无需命令行标志）。

## 目录结构

```
code/ch26/app/
├── package.json
├── tsconfig.json
├── .env.example
├── data/                     # SQLite 数据库文件放这里（.gitignore 已忽略 *.db）
└── src/
    ├── domain/               # 领域层：模型、错误、校验（不依赖任何框架）
    │   ├── task.ts
    │   ├── errors.ts
    │   └── validation.ts
    ├── config/config.ts      # 类型化配置（解析 + 校验环境变量）
    ├── repository/taskRepository.ts   # 仓储层：node:sqlite 持久化
    ├── service/taskService.ts         # 业务逻辑层（依赖注入 repo）
    ├── http/                 # HTTP 层：Express 装配
    │   ├── app.ts            # composition root：把各层拼起来
    │   ├── tasksRouter.ts
    │   └── errorHandler.ts
    ├── client/               # CLI 用的 API 客户端与工具
    │   ├── apiClient.ts
    │   └── colors.ts
    ├── server.ts             # 后端入口
    └── cli.ts                # CLI 入口
└── test/                     # Vitest 测试
    ├── taskService.test.ts
    └── validation.test.ts
```

## 安装

```bash
cd code/ch26/app
npm install
```

## 运行后端

```bash
# 用默认配置（端口 3000，数据库 data/tasks.db）
npx tsx src/server.ts

# 或自定义配置
PORT=3199 DB_FILE=data/tasks.db npx tsx src/server.ts
```

健康检查：

```bash
curl http://localhost:3000/health
# {"status":"ok","time":"..."}
```

## 使用 CLI（另开一个终端）

CLI 默认连 `http://localhost:3000`，可用 `API_URL` 覆盖。

```bash
npx tsx src/cli.ts add "买菜"
npx tsx src/cli.ts add "写第26章"
npx tsx src/cli.ts list            # 全部
npx tsx src/cli.ts list --todo     # 只看未完成
npx tsx src/cli.ts list --done     # 只看已完成
npx tsx src/cli.ts done 3f2a       # id 可只写前几位
npx tsx src/cli.ts rm 3f2a
npx tsx src/cli.ts help
```

## 也可以直接用 curl 打通

```bash
curl -s -X POST localhost:3000/tasks -H 'Content-Type: application/json' -d '{"title":"买菜"}'
curl -s localhost:3000/tasks
curl -s -X PATCH localhost:3000/tasks/<id> -H 'Content-Type: application/json' -d '{"done":true}'
curl -s -X DELETE localhost:3000/tasks/<id> -i
```

## 测试

```bash
npm test        # vitest run，覆盖 service/repository（内存库）与校验函数
```

## 类型检查

```bash
npm run typecheck
```

## REST API 速查

| 方法 | 路径 | 说明 | 成功状态码 |
| --- | --- | --- | --- |
| GET | `/health` | 健康检查 | 200 |
| GET | `/tasks?done=&page=&pageSize=` | 列表（筛选 + 分页） | 200 |
| GET | `/tasks/:id` | 取单个 | 200 / 404 |
| POST | `/tasks` | 新建（body: `{title, done?}`） | 201 |
| PATCH | `/tasks/:id` | 局部更新（body: `{title?, done?}`） | 200 / 404 |
| DELETE | `/tasks/:id` | 删除 | 204 / 404 |

错误统一返回 `{ "error": string, "details"?: string[] }`。
