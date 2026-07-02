// 文件：code/ch11/01-fs.js
// 演示 fs 的三种风格：同步、回调异步、Promise。
// 为了不污染项目目录，所有临时文件都写到系统临时目录 os.tmpdir()。

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import fs from "node:fs"; // 回调风格也在这个默认导出上
import fsp from "node:fs/promises"; // Promise 版
import os from "node:os";
import path from "node:path";

// 在系统临时目录里造一个本例专用的文件路径
const tmpFile = path.join(os.tmpdir(), "ch11-fs-demo.txt");

// ---------- 1) 同步（sync）：会阻塞，直到读写完成 ----------
writeFileSync(tmpFile, "第一行\n", "utf8");
const text1 = readFileSync(tmpFile, "utf8");
console.log("[sync] 读到：", JSON.stringify(text1));
console.log("[sync] 文件存在吗？", existsSync(tmpFile));

// ---------- 2) 回调异步（callback）：不阻塞，结果通过回调返回 ----------
fs.appendFile(tmpFile, "第二行\n", "utf8", (err) => {
  if (err) {
    console.error("追加失败：", err);
    return;
  }
  fs.readFile(tmpFile, "utf8", (err2, data) => {
    if (err2) {
      console.error("读取失败：", err2);
      return;
    }
    console.log("[callback] 追加后内容：", JSON.stringify(data));

    // ---------- 3) Promise 版（推荐）：配合 async/await 最清爽 ----------
    runPromiseDemo();
  });
});

async function runPromiseDemo() {
  await fsp.appendFile(tmpFile, "第三行\n", "utf8");
  const text3 = await fsp.readFile(tmpFile, "utf8");
  console.log("[promises] 最终内容：\n" + text3);

  // 清理：删掉临时文件
  await fsp.rm(tmpFile);
  console.log("[promises] 已清理临时文件");
}
