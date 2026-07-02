// 文件：code/ch26/app/src/cli.ts
// CLI 客户端入口：解析命令行参数（argv）→ 分发到子命令 → 用 ApiClient 调后端。
// 运行：npx tsx src/cli.ts <命令> [参数]
//
// 支持的子命令：
//   add <title>       新建任务
//   list [--done]     列出任务（--done 只看已完成，--todo 只看未完成）
//   done <id>         把任务标记为已完成
//   rm <id>           删除任务
//
// 后端地址默认 http://localhost:3000，可用环境变量 API_URL 覆盖。

import { ApiClient, ApiError } from "./client/apiClient.js";
import { color } from "./client/colors.js";
import type { Task } from "./domain/task.js";

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const client = new ApiClient(API_URL);

/** 打印用法说明。 */
function printUsage(): void {
  console.log(`${color.bold("任务管理器 CLI")}  —  后端：${color.gray(API_URL)}

用法：
  ${color.cyan("tsx src/cli.ts add")} <标题>        新建一个任务
  ${color.cyan("tsx src/cli.ts list")} [--done|--todo]  列出任务（默认全部）
  ${color.cyan("tsx src/cli.ts done")} <id>          标记任务为已完成
  ${color.cyan("tsx src/cli.ts rm")} <id>            删除任务

示例：
  tsx src/cli.ts add "买菜"
  tsx src/cli.ts list --todo
  tsx src/cli.ts done 3f2a...   （id 可只写前几位）`);
}

/** 把一个 Task 格式化成一行好看的输出。 */
function formatTask(t: Task): string {
  const mark = t.done ? color.green("✓") : color.yellow("○");
  const idShort = color.gray(t.id.slice(0, 8));
  const title = t.done ? color.gray(t.title) : t.title;
  return `${mark} ${idShort}  ${title}`;
}

/**
 * 允许用「id 前缀」定位任务：先拉全部，找出 id 以给定前缀开头的那个。
 * 命中 0 个或多个都算错误。这让 CLI 用起来更顺手（不用复制整段 UUID）。
 */
async function resolveId(prefix: string): Promise<string> {
  const { items } = await client.list();
  const matches = items.filter((t) => t.id.startsWith(prefix));
  if (matches.length === 0) throw new ApiError(404, `没有 id 以 "${prefix}" 开头的任务`);
  if (matches.length > 1) {
    throw new ApiError(400, `"${prefix}" 匹配到多个任务，请多写几位以区分`);
  }
  return matches[0]!.id;
}

// —— 各子命令的实现 ——

async function cmdAdd(args: string[]): Promise<void> {
  const title = args.join(" ").trim();
  if (!title) throw new UsageError('add 需要一个标题，例如：add "买菜"');
  const task = await client.create({ title });
  console.log(`${color.green("已添加")}  ${formatTask(task)}`);
}

async function cmdList(args: string[]): Promise<void> {
  let done: boolean | undefined;
  if (args.includes("--done")) done = true;
  else if (args.includes("--todo")) done = false;

  const { items, total } = await client.list(done);
  if (items.length === 0) {
    console.log(color.gray("（没有符合条件的任务）"));
    return;
  }
  for (const t of items) console.log(formatTask(t));
  console.log(color.gray(`\n共 ${total} 条`));
}

async function cmdDone(args: string[]): Promise<void> {
  const prefix = args[0];
  if (!prefix) throw new UsageError("done 需要一个任务 id，例如：done 3f2a");
  const id = await resolveId(prefix);
  const task = await client.update(id, { done: true });
  console.log(`${color.green("已完成")}  ${formatTask(task)}`);
}

async function cmdRm(args: string[]): Promise<void> {
  const prefix = args[0];
  if (!prefix) throw new UsageError("rm 需要一个任务 id，例如：rm 3f2a");
  const id = await resolveId(prefix);
  await client.remove(id);
  console.log(`${color.red("已删除")}  ${color.gray(id.slice(0, 8))}`);
}

/** 用法错误（区别于 ApiError）：提示用户命令写法不对。 */
class UsageError extends Error {}

/** 主流程：读 argv，分发到子命令。 */
async function main(): Promise<void> {
  // process.argv 前两项是 [node, 脚本路径]，真正的参数从第 3 项开始。
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case "add":
      return cmdAdd(rest);
    case "list":
      return cmdList(rest);
    case "done":
      return cmdDone(rest);
    case "rm":
      return cmdRm(rest);
    case undefined:
    case "help":
    case "--help":
    case "-h":
      printUsage();
      return;
    default:
      throw new UsageError(`未知命令：${command}`);
  }
}

// 顶层错误处理：把不同错误翻译成友好的提示，并设置合适的退出码
// （退出码非 0 让脚本/CI 能感知失败——第 25 章）。
main().catch((err: unknown) => {
  if (err instanceof UsageError) {
    console.error(color.red(`用法错误：${err.message}`));
    console.error(color.gray("运行 `tsx src/cli.ts help` 查看用法"));
  } else if (err instanceof ApiError) {
    console.error(color.red(`请求失败（${err.status}）：${err.message}`));
  } else {
    console.error(color.red("发生未知错误："), err);
  }
  process.exitCode = 1;
});
