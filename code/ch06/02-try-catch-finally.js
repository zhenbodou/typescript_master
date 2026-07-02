// 文件：code/ch06/02-try-catch-finally.js
// 运行方式：node 02-try-catch-finally.js
// 主题：try / catch / finally、catch 的绑定、重新抛出（rethrow）

// 1) 基本三段式
function parseAge(input) {
  try {
    const n = Number(input);
    if (Number.isNaN(n)) {
      throw new Error(`"${input}" 不是有效数字`);
    }
    console.log("try：解析成功，年龄 =", n);
    return n;
  } catch (e) {
    console.log("catch：出错了 ->", e.message);
    return -1; // 出错时返回一个兜底值
  } finally {
    console.log("finally：无论成功失败都会执行（比如关闭资源）");
  }
}

console.log("=== 合法输入 ===");
parseAge("30");
console.log("=== 非法输入 ===");
parseAge("abc");

// 2) catch 可以省略绑定（不关心错误对象时）
function tryRun(fn) {
  try {
    fn();
    return true;
  } catch {
    // 注意：这里没有写 catch (e)
    return false;
  }
}
console.log("\ntryRun 成功吗？", tryRun(() => JSON.parse("{}")));
console.log("tryRun 成功吗？", tryRun(() => JSON.parse("{坏}")));

// 3) finally 的“陷阱”：finally 里的 return 会覆盖 try 的 return
function trap() {
  try {
    return "来自 try";
  } finally {
    return "来自 finally"; // ⚠️ 这个会赢
  }
}
console.log("\ntrap() 返回：", trap()); // "来自 finally"

// 4) 重新抛出（rethrow）：自己处理不了的错，包装后往上抛
function readConfig(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    // 记一笔日志，但不吞掉错误——重新抛出让上层决定怎么办
    console.log("readConfig：解析失败，记录日志后重新抛出");
    throw new Error("配置文件损坏", { cause: e });
  }
}

try {
  readConfig("这不是 JSON");
} catch (e) {
  console.log("上层收到：", e.message);
  console.log("原始错误（cause）：", e.cause.message);
}
