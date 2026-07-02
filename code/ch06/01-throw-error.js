// 文件：code/ch06/01-throw-error.js
// 运行方式：node 01-throw-error.js
// 主题：错误是什么、throw、Error 对象（message / name / stack）

// 1) 最原始的“抛错”：throw 后面可以跟任何值
function withdraw(balance, amount) {
  if (amount > balance) {
    // 不推荐：抛一个普通字符串，信息太少
    throw "余额不足";
  }
  return balance - amount;
}

try {
  withdraw(100, 200);
} catch (e) {
  console.log("捕获到（字符串）：", e); // "余额不足"
  console.log("它有 stack 吗？", e.stack); // undefined，字符串没有 stack
}

// 2) 推荐：抛一个 Error 对象，携带 message / name / stack
function withdraw2(balance, amount) {
  if (amount > balance) {
    throw new Error(`余额不足：想取 ${amount}，但只有 ${balance}`);
  }
  return balance - amount;
}

try {
  withdraw2(100, 200);
} catch (e) {
  console.log("\n捕获到（Error）：");
  console.log("  name    =", e.name); // "Error"
  console.log("  message =", e.message); // 我们写的那句话
  console.log("  是 Error 实例吗？", e instanceof Error); // true
  console.log("  stack 前两行：");
  console.log(
    e.stack
      .split("\n")
      .slice(0, 2)
      .map((line) => "    " + line)
      .join("\n")
  );
}

// 3) 抛错会“中断”后续代码：错误像电梯一样一路上升
function a() {
  b();
  console.log("a 的这行永远不会执行"); // 被跳过
}
function b() {
  throw new Error("b 出问题了");
}

try {
  a();
} catch (e) {
  console.log("\n在最外层 catch 到了：", e.message);
}

console.log("\n程序继续正常往下走。");
