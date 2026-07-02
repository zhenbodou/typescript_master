// 文件：code/ch11/01b-fs-dir.js
// 演示目录相关操作：创建目录、写入多个文件、读目录、删除。
// 全程在临时目录里完成并清理。

import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";

async function main() {
  // mkdtemp 会创建一个带随机后缀的临时目录，避免冲突
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "ch11-dir-"));
  console.log("创建目录：", dir);

  // 往目录里写三个文件
  await fsp.writeFile(path.join(dir, "a.txt"), "AAA");
  await fsp.writeFile(path.join(dir, "b.txt"), "BBB");
  await fsp.writeFile(path.join(dir, "c.log"), "CCC");

  // 读目录：默认返回文件名字符串数组
  const names = await fsp.readdir(dir);
  console.log("目录内容：", names);

  // withFileTypes 让我们能区分文件和子目录
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    console.log(`  ${e.name} —— 是文件吗？ ${e.isFile()}`);
  }

  // 递归删除整个目录（recursive: true 相当于 rm -rf）
  await fsp.rm(dir, { recursive: true, force: true });
  console.log("已删除目录");
}

main();
