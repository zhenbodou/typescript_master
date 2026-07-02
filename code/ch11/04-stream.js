// 文件：code/ch11/04-stream.js
// 演示流（Stream）：为什么用流，以及可读流 / 可写流 / pipe / readline。

import fsp from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const bigFile = path.join(os.tmpdir(), "ch11-big.txt");
const copyFile = path.join(os.tmpdir(), "ch11-big-copy.txt");

async function main() {
  // 先造一个"大"文件：1000 行
  let content = "";
  for (let i = 1; i <= 1000; i++) {
    content += `第 ${i} 行\n`;
  }
  await fsp.writeFile(bigFile, content, "utf8");

  // 1) 用 pipe 把可读流接到可写流，实现"边读边写"的复制。
  //    数据是一块一块（chunk）流过去的，内存里从不会同时装下整个文件。
  const readable = createReadStream(bigFile);
  const writable = createWriteStream(copyFile);
  await pipeline(readable, writable); // pipeline 会自动处理错误和收尾
  console.log("已用流复制文件");

  // 2) 用 readline 按行读取（大文件按行处理的标准做法）
  const rl = createInterface({
    input: createReadStream(copyFile, "utf8"),
    crlfDelay: Infinity, // 正确处理 Windows 的 \r\n
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    // 只打印前 3 行，证明是逐行拿到的
    if (lineCount <= 3) console.log(`readline 拿到：${line}`);
  }
  console.log(`一共读到 ${lineCount} 行`);

  // 3) 顺带看看 Buffer：不带编码读，拿到的是二进制 Buffer
  const buf = await fsp.readFile(copyFile);
  console.log("Buffer 长度(字节)：", buf.length);
  console.log("前 10 个字节：", buf.subarray(0, 10));

  // 清理
  await fsp.rm(bigFile);
  await fsp.rm(copyFile);
  console.log("已清理临时文件");
}

main();
