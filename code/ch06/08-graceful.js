// 文件：code/ch06/08-graceful.js
// 运行方式：node 08-graceful.js
// 主题：优雅降级（graceful degradation）与错误恢复策略

// 场景：从“缓存”读取用户头像，读不到就退回默认头像；再叠加“重试”策略。

// 1) 兜底默认值：出错不让整个程序崩，而是返回一个安全的替代
function getAvatar(user) {
  try {
    // 假装这里可能因为 user 结构不完整而抛错
    return user.profile.avatarUrl.trim();
  } catch {
    return "/images/default-avatar.png"; // 优雅降级
  }
}
console.log("① 正常：", getAvatar({ profile: { avatarUrl: "  /a.png " } }));
console.log("① 降级：", getAvatar({})); // 缺字段也不崩

// 2) 重试（retry）：临时性故障（如网络抖动）重试几次再放弃
function makeFlaky(failTimes) {
  let calls = 0;
  return function () {
    calls++;
    if (calls <= failTimes) {
      throw new Error(`第 ${calls} 次调用失败`);
    }
    return `第 ${calls} 次成功`;
  };
}

function withRetry(fn, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
      console.log(`  重试逻辑：第 ${attempt} 次失败（${e.message}）`);
    }
  }
  // 试满还失败，就把最后一次错误抛出去
  throw new Error(`重试 ${maxAttempts} 次仍失败`, { cause: lastError });
}

console.log("\n② 重试成功：");
const flaky = makeFlaky(2); // 前两次失败，第三次成功
console.log("  最终结果：", withRetry(flaky, 3));

console.log("\n③ 重试耗尽：");
try {
  const alwaysFail = makeFlaky(99);
  withRetry(alwaysFail, 3);
} catch (e) {
  console.log("  放弃：", e.message, "/ 根因：", e.cause.message);
}

// 3) 部分失败不影响整体：批处理时逐项 try/catch，汇总成功与失败
function processAll(items, handler) {
  const results = { ok: [], failed: [] };
  for (const item of items) {
    try {
      results.ok.push(handler(item));
    } catch (e) {
      results.failed.push({ item, reason: e.message });
    }
  }
  return results;
}

const out = processAll([2, 0, 5, -1], (n) => {
  if (n <= 0) throw new Error("必须为正数");
  return 100 / n;
});
console.log("\n④ 批处理结果：");
console.log("  成功：", out.ok);
console.log("  失败：", out.failed);
