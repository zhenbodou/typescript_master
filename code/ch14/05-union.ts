// 文件：code/ch14/05-union.ts
// 联合类型（union）与字面量类型：建模"多选一"

// 1) 基础联合：值可以是 number 或 string
function formatId(id: number | string): string {
  // 此处 id 的类型是 number | string，只能用"两者都有"的成员
  return `ID: ${id}`;
}
console.log(formatId(123));
console.log(formatId("abc"));

// 2) 字面量类型 + 联合 = "字符串枚举"效果
type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string): void {
  console.log(`[${level.toUpperCase()}] ${message}`);
}
log("info", "服务已启动");
log("error", "连接失败");
// log("verbose", "..."); // ⚠️ 报错：'verbose' 不在 LogLevel 允许的取值内

// 3) 数字字面量联合
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
function roll(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}
console.log("掷出：", roll());

// 4) 类型收窄入门：typeof / 字面量
function describe(x: number | string | boolean): string {
  if (typeof x === "number") {
    return `数字，平方是 ${x * x}`; // 这个分支里 x 被收窄为 number
  } else if (typeof x === "string") {
    return `字符串，长度是 ${x.length}`; // 收窄为 string
  } else {
    return `布尔值：${x ? "真" : "假"}`; // 收窄为 boolean
  }
}
console.log(describe(5));
console.log(describe("hello"));
console.log(describe(true));

export {};
