// 文件：code/ch13/config.ts
// 本章小项目：类型化配置读取器（typed config reader）。
// 运行：npx tsx ch13/config.ts

// ============================================================
// 1) 定义"目标类型"：我们的应用最终想要的强类型配置形状。
// ============================================================
type AppConfig = {
  port: number;
  host: string;
  debug: boolean;
  tags: string[];
};

// 一份默认值。当原始输入缺某项时，就用它兜底。
// readonly 保证默认值不会被手滑改掉。
const DEFAULTS: Readonly<AppConfig> = {
  port: 3000,
  host: "localhost",
  debug: false,
  tags: [],
};

// ============================================================
// 2) 描述"原始输入"：模拟从环境变量 / JSON 读来的数据。
//    真实世界里这种数据的键值全是字符串，而且可能缺项。
//    我们用 Record<string, string> 表达"键是字符串、值也是字符串"。
// ============================================================
type RawInput = Record<string, string>;

// ============================================================
// 3) 一组类型安全的"解析 + 兜底"小工具。
//    每个都接收 "可能为 undefined 的字符串" 和一个默认值，
//    返回强类型结果。
// ============================================================

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const n = Number(value);
  // NaN 检查：Number("abc") 会得到 NaN，这时回退到默认值。
  return Number.isNaN(n) ? fallback : n;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  // 约定："true" / "1" 视为 true，其余视为 false。
  return value === "true" || value === "1";
}

function parseTags(value: string | undefined, fallback: string[]): string[] {
  if (value === undefined || value.trim() === "") return fallback;
  // 逗号分隔，去掉首尾空白，过滤空串。
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// ============================================================
// 4) 核心函数：把宽松的 RawInput 转换成强类型 AppConfig。
//    返回类型标成 AppConfig，编译器会强制我们"每个字段都补齐"。
// ============================================================
function loadConfig(raw: RawInput): AppConfig {
  return {
    port: parseNumber(raw.port, DEFAULTS.port),
    host: raw.host ?? DEFAULTS.host, // 字符串直接用 ?? 兜底
    debug: parseBoolean(raw.debug, DEFAULTS.debug),
    tags: parseTags(raw.tags, DEFAULTS.tags),
  };
  // 如果这里少写一个字段（比如忘了 tags），TS 会报错：
  //   Property 'tags' is missing in type ... 这正是类型注解在帮你。
}

// ============================================================
// 5) 演示：模拟两份不同的原始输入。
// ============================================================

// 一份"完整且部分带脏数据"的输入。
const fromEnv: RawInput = {
  port: "8080",
  host: "0.0.0.0",
  debug: "1",
  tags: "web, api ,,cache",
};

// 一份"残缺"的输入：只给了 port，其余走默认值。
const partial: RawInput = {
  port: "not-a-number", // 脏数据，会被 NaN 检查挡下、回退默认
};

const configA = loadConfig(fromEnv);
const configB = loadConfig(partial);

console.log("configA =", configA);
console.log("configB =", configB);

// 因为返回值是强类型 AppConfig，下面这些用法都有编辑器提示和检查：
console.log(`服务将监听 ${configA.host}:${configA.port}`);
console.log("标签数量：", configA.tags.length);

// 下面这行如果取消注释会报错，证明类型确实在保护我们：
// configA.port.toUpperCase(); // ❌ number 上没有 toUpperCase

export {};
