// 文件：code/ch25/graceful-shutdown.ts
// "上线前完善"的最小任务服务：健康检查、结构化日志、环境变量配置、
// 计时中间件、优雅关闭（graceful shutdown）。
// 运行：npx tsx ch25/graceful-shutdown.ts
// 演示自测：npx tsx ch25/graceful-shutdown.ts --selftest

import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";

// ---------------------------------------------------------------------------
// 1) 配置：从环境变量读，给出默认值与类型转换。
// ---------------------------------------------------------------------------
interface Config {
  port: number;
  nodeEnv: string;
  shutdownTimeoutMs: number;
}

function loadConfig(): Config {
  return {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    shutdownTimeoutMs: Number(process.env.SHUTDOWN_TIMEOUT_MS ?? 10_000),
  };
}

// ---------------------------------------------------------------------------
// 2) 结构化日志：输出一行 JSON，方便被日志系统采集与检索。
// ---------------------------------------------------------------------------
function log(level: "info" | "warn" | "error", msg: string, extra: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...extra });
  // 错误走 stderr，其余走 stdout——这是进程管理器/容器的惯例。
  if (level === "error") console.error(line);
  else console.log(line);
}

// ---------------------------------------------------------------------------
// 3) 内存态"任务"数据 + 简单路由。
// ---------------------------------------------------------------------------
interface Task {
  id: number;
  title: string;
  done: boolean;
}
const tasks: Task[] = [{ id: 1, title: "写第 25 章", done: false }];

// 标记：一旦开始关闭，健康检查就返回"不健康"，让负载均衡把流量摘走。
let shuttingDown = false;

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const start = performance.now();
  const { method = "GET", url = "/" } = req;

  // --- 计时中间件：请求结束时记录耗时 ---
  res.on("finish", () => {
    const ms = performance.now() - start;
    log("info", "request", { method, url, status: res.statusCode, ms: Number(ms.toFixed(2)) });
  });

  const send = (status: number, body: unknown): void => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };

  // --- 健康检查端点 ---
  if (url === "/health") {
    if (shuttingDown) return send(503, { status: "shutting_down" });
    return send(200, { status: "ok", uptime: process.uptime() });
  }

  // --- 业务端点 ---
  if (method === "GET" && url === "/tasks") {
    return send(200, { tasks });
  }

  return send(404, { error: "not_found" });
}

// ---------------------------------------------------------------------------
// 4) 启动服务 + 优雅关闭。
// ---------------------------------------------------------------------------
function main(): http.Server {
  const config = loadConfig();
  const server = http.createServer(handleRequest);

  server.listen(config.port, () => {
    log("info", "server_started", { port: config.port, env: config.nodeEnv });
  });

  // 优雅关闭：收到信号后停止接收新连接，等现有请求处理完再退出；超时则强制退出。
  const shutdown = (signal: string): void => {
    if (shuttingDown) return; // 防止重复触发。
    shuttingDown = true;
    log("warn", "shutdown_start", { signal });

    // server.close 会等所有活跃连接结束，然后回调。
    server.close(() => {
      log("info", "shutdown_complete");
      process.exit(0);
    });

    // 兜底：超过 shutdownTimeoutMs 还没关完，就强制退出，避免进程"卡死"。
    const timer = setTimeout(() => {
      log("error", "shutdown_forced_timeout");
      process.exit(1);
    }, config.shutdownTimeoutMs);
    timer.unref(); // 让这个定时器不要单独把进程"钉住"。
  };

  process.on("SIGTERM", () => shutdown("SIGTERM")); // 容器/pm2 停止时发送。
  process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C。

  return server;
}

// ---------------------------------------------------------------------------
// 5) 自测模式：启动服务 -> 打两个请求 -> 发 SIGTERM -> 断言优雅退出。
//    这样即使不手动 curl，也能在 CI/本机自动验证核心行为。
// ---------------------------------------------------------------------------
async function selftest(): Promise<void> {
  process.env.PORT = "3999";
  process.env.SHUTDOWN_TIMEOUT_MS = "2000";
  const server = main();

  await new Promise((r) => setTimeout(r, 200)); // 等服务起来。

  const get = (path: string): Promise<{ status: number; body: string }> =>
    new Promise((resolve, reject) => {
      http
        .get({ host: "127.0.0.1", port: 3999, path }, (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => resolve({ status: res.statusCode ?? 0, body: data }));
        })
        .on("error", reject);
    });

  const health = await get("/health");
  const list = await get("/tasks");
  const missing = await get("/nope");

  console.log("--- 自测断言 ---");
  const assert = (cond: boolean, name: string): void => {
    if (!cond) {
      log("error", "assert_failed", { name });
      process.exitCode = 1;
    } else {
      console.log("OK:", name);
    }
  };
  assert(health.status === 200 && health.body.includes('"ok"'), "/health 返回 200 ok");
  assert(list.status === 200 && list.body.includes("写第 25 章"), "/tasks 返回任务列表");
  assert(missing.status === 404, "未知路径返回 404");

  // 触发优雅关闭：把 SIGTERM 发给自己。
  // server.close 的回调里会 process.exit(0)，进程正常结束即代表优雅关闭成功。
  log("info", "selftest_send_SIGTERM");
  process.kill(process.pid, "SIGTERM");

  // 保险：8 秒内没退出就判定失败。
  setTimeout(() => {
    log("error", "selftest_did_not_exit");
    process.exit(1);
  }, 8000).unref();
}

// 入口：带 --selftest 走自测，否则正常启动。
if (process.argv.includes("--selftest")) {
  void selftest();
} else {
  main();
}
