// 文件：code/ch11/log-analyzer.js
// 一个日志分析命令行工具（CLI）。
// 用法：node log-analyzer.js [日志文件路径]
// 不传参数时，默认分析同目录下的 sample.log。
//
// 它用 readline 逐行读取（流式处理），因此即使日志有几个 GB 也不会撑爆内存。

import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM 下没有 __dirname，需要自己算出脚本所在目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1) 解析命令行参数：process.argv 从下标 2 开始才是用户传的参数
//    没传就用同目录下的 sample.log 作为默认值
const inputArg = process.argv[2];
const logPath = inputArg
  ? path.resolve(process.cwd(), inputArg) // 相对用户当前目录解析
  : path.join(__dirname, "sample.log");

// 一行日志形如：2026-07-01 09:05:51 ERROR failed to connect ...
// 用一个简单的分割规则解析出时间、级别、消息
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null; // 跳过空行

  // 前两段是日期和时间，第三段是级别，剩下的是消息
  const parts = trimmed.split(/\s+/);
  if (parts.length < 3) return null;

  const time = parts[1]; // HH:MM:SS
  const level = parts[2].toUpperCase(); // INFO / WARN / ERROR
  const hour = time.slice(0, 2); // 取前两位当小时
  const message = parts.slice(3).join(" ");
  return { level, hour, message, raw: trimmed };
}

async function analyze(filePath) {
  // 先确认文件存在，给出友好错误而不是崩溃
  try {
    await access(filePath);
  } catch {
    console.error(`❌ 找不到日志文件：${filePath}`);
    process.exit(1); // 非 0 退出码表示失败
  }

  const stats = {
    total: 0,
    byLevel: { INFO: 0, WARN: 0, ERROR: 0, OTHER: 0 },
    byHour: {}, // { "09": 5, "10": 3, ... }
    errors: [], // 所有 ERROR 行的原文
  };

  const rl = createInterface({
    input: createReadStream(filePath, "utf8"),
    crlfDelay: Infinity,
  });

  // for await...of 逐行拿到内容，一行处理完才拿下一行
  for await (const line of rl) {
    const parsed = parseLine(line);
    if (!parsed) continue;

    stats.total++;

    // 按级别统计
    if (parsed.level in stats.byLevel) {
      stats.byLevel[parsed.level]++;
    } else {
      stats.byLevel.OTHER++;
    }

    // 按小时统计
    stats.byHour[parsed.hour] = (stats.byHour[parsed.hour] || 0) + 1;

    // 收集 ERROR 原文
    if (parsed.level === "ERROR") {
      stats.errors.push(parsed.raw);
    }
  }

  return stats;
}

function printReport(filePath, stats) {
  console.log("========================================");
  console.log(" 日志分析报告");
  console.log("========================================");
  console.log(`文件：${filePath}`);
  console.log(`总行数：${stats.total}`);
  console.log("");

  console.log("按级别统计：");
  for (const [level, count] of Object.entries(stats.byLevel)) {
    if (count === 0) continue;
    console.log(`  ${level.padEnd(6)} ${count}`);
  }
  console.log("");

  console.log("按小时统计（请求数）：");
  const hours = Object.keys(stats.byHour).sort();
  for (const h of hours) {
    const count = stats.byHour[h];
    const bar = "█".repeat(count); // 用方块画一个简易柱状图
    console.log(`  ${h}:00  ${String(count).padStart(3)} ${bar}`);
  }
  console.log("");

  console.log(`ERROR 明细（共 ${stats.errors.length} 条）：`);
  if (stats.errors.length === 0) {
    console.log("  （无）");
  } else {
    for (const e of stats.errors) {
      console.log(`  - ${e}`);
    }
  }
  console.log("========================================");
}

const stats = await analyze(logPath);
printReport(logPath, stats);
