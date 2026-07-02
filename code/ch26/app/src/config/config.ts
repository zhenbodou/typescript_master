// 文件：code/ch26/app/src/config/config.ts
// 类型化配置（typed config，第 13 章思想）：把宽松的 process.env（string | undefined）
// 解析、校验成强类型 AppConfig。缺失/非法就「快速失败」（fail fast），启动即报错。

import path from "node:path";
import { fileURLToPath } from "node:url";

/** 应用最终想要的强类型配置形状。 */
export interface AppConfig {
  /** HTTP 监听端口。 */
  port: number;
  /** SQLite 数据库文件的绝对路径。 */
  dbFile: string;
  /** 运行环境：影响日志、错误详情等行为。 */
  nodeEnv: "development" | "production" | "test";
}

// 当前文件所在目录（ESM 里没有 __dirname，用 import.meta.url 还原）。
const here = path.dirname(fileURLToPath(import.meta.url));
// 默认把数据库放在项目的 data/ 目录下。
const defaultDbFile = path.resolve(here, "../../data/tasks.db");

/** 把字符串解析成端口号；非法或缺失时回退到默认值。 */
function parsePort(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error(`配置错误：PORT 必须是 1~65535 的整数，收到的是 "${value}"`);
  }
  return n;
}

/** 校验 NODE_ENV，只允许三个取值之一。 */
function parseNodeEnv(value: string | undefined): AppConfig["nodeEnv"] {
  const v = value ?? "development";
  if (v === "development" || v === "production" || v === "test") return v;
  throw new Error(`配置错误：NODE_ENV 只能是 development/production/test，收到的是 "${v}"`);
}

/**
 * 从一份「原始环境变量」构造强类型 AppConfig。
 * 默认读 process.env，测试时也可以传入自定义对象，方便断言。
 */
export function loadConfig(
  env: Record<string, string | undefined> = process.env,
): AppConfig {
  return {
    port: parsePort(env.PORT, 3000),
    dbFile: env.DB_FILE ? path.resolve(env.DB_FILE) : defaultDbFile,
    nodeEnv: parseNodeEnv(env.NODE_ENV),
  };
}
