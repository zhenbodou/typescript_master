# 任务管理 REST API（第 23 章小项目）

Express + TypeScript 实现的任务（Task）管理 REST API，数据存内存。第 24 章会把 store 换成真正的数据库。

## 安装与运行

```bash
cd code/ch23/api
npm install
npx tsx src/server.ts   # 或 npm start
```

启动后监听 `http://localhost:3000`（可用 `PORT=4000 npm start` 改端口）。

其它脚本：

```bash
npm run dev        # tsx watch，改代码自动重启
npm run typecheck  # tsc --noEmit，只做类型检查
npm run smoke      # 用代码把所有端点跑一遍（supertest 思想）
```

## 目录结构（分层）

```
src/
  server.ts               入口：创建 app 并监听端口
  app.ts                  组装：中间件 + 路由 + 错误处理
  types.ts                领域模型与输入类型
  errors.ts               自定义 HTTP 错误
  validation.ts           请求体校验
  routes/tasks.ts         路由层：解析 HTTP，调 service
  services/taskService.ts 业务层：筛选、分页、找不到报 404
  store/taskStore.ts      数据层：内存数组（第 24 章换数据库）
  middleware/
    logger.ts             请求日志
    cors.ts               极简 CORS
    errorHandler.ts       统一错误处理 + 404
scripts/smoke.ts          冒烟测试
```

## 端点与 curl 示例

假设服务在 `http://localhost:3000`。

### 创建任务 `POST /tasks`

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"买牛奶"}'
```

预期 `201 Created`：

```json
{
  "id": "…uuid…",
  "title": "买牛奶",
  "done": false,
  "createdAt": "2026-07-02T08:00:00.000Z"
}
```

校验失败（如空 title）返回 `400`：

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" -d '{"title":""}'
```

```json
{ "error": "请求校验失败", "details": ["title 必填，且必须是非空字符串"] }
```

### 列表 `GET /tasks`（支持筛选与分页）

```bash
curl "http://localhost:3000/tasks"
curl "http://localhost:3000/tasks?done=false"
curl "http://localhost:3000/tasks?page=1&pageSize=5"
```

```json
{ "items": [ /* … */ ], "page": 1, "pageSize": 10, "total": 1 }
```

### 查询单个 `GET /tasks/:id`

```bash
curl http://localhost:3000/tasks/<id>
```

不存在返回 `404`：`{ "error": "找不到 id 为 <id> 的任务" }`

### 局部更新 `PATCH /tasks/:id`

```bash
curl -X PATCH http://localhost:3000/tasks/<id> \
  -H "Content-Type: application/json" -d '{"done":true}'
```

预期 `200`，返回更新后的任务。

### 删除 `DELETE /tasks/:id`

```bash
curl -i -X DELETE http://localhost:3000/tasks/<id>
```

预期 `204 No Content`（无响应体）。
