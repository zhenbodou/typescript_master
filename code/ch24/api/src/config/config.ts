// 文件：code/ch24/api/src/config/config.ts
// 类型化配置模块（typed config）。
// 沿用第 13 章「把宽松的字符串输入解析成强类型配置」的思想，
// 这次数据来源是【环境变量】：process.env（值全是 string | undefined）。
//
// 关键原则：
//   - 敏感信息（数据库路径、密钥）来自环境，不写死在代码里、不进 git。
//   - 缺失的必填项要「快速失败」（fail fast），启动时就报错，而不是等到运行时才崩。

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
    // 字符串直接用 ?? 兜底；给了就用给的（可为相对或绝对路径，这里转成绝对）。
    dbFile: env.DB_FILE ? path.resolve(env.DB_FILE) : defaultDbFile,
    nodeEnv: parseNodeEnv(env.NODE_ENV),
  };
}
