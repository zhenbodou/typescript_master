// 文件：code/ch15/05-enum.ts
// 枚举 enum：数字枚举、字符串枚举、const enum、运行时形态与坑，以及现代替代方案。
// 运行：npx tsx ch15/05-enum.ts

// ---------- 1) 数字枚举（默认从 0 递增） ----------
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}
console.log(Direction.Up, Direction.Right); // 0 3

// ⚠️ 数字枚举有「反向映射（reverse mapping）」：既能名→值，也能值→名。
console.log(Direction[0]); // "Up" —— 用数字反查名字
// 这意味着编译后它是一个双向填充的对象，体积更大，也更容易被误用。

// ---------- 2) 字符串枚举（每个成员必须显式赋字符串值） ----------
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}
console.log(LogLevel.Warn); // "WARN"
// 字符串枚举【没有】反向映射：LogLevel["WARN"] 是 undefined，日志/序列化时更可读、更安全。

// ---------- 3) 枚举的运行时形态 ----------
// 普通 enum 会被编译成一个真实存在的对象。运行时可以遍历、可以传递。
console.log("LogLevel 运行时对象：", LogLevel);
// { Debug: 'DEBUG', Info: 'INFO', Warn: 'WARN', Error: 'ERROR' }

// ---------- 4) const enum：编译期内联，运行时"消失" ----------
const enum Planet {
  Mercury,
  Venus,
  Earth,
}
const home = Planet.Earth; // 编译后直接被替换成字面量 2，Planet 对象根本不生成
console.log("home =", home); // 2
// ⚠️ const enum 省体积，但有坑：跨模块/隔离编译（isolatedModules、某些打包器）下可能出问题，
//    因为它依赖编译期把引用内联。库作者尤其要谨慎。

// ---------- 5) 现代替代：联合字面量类型 + as const 对象 ----------
// as const 把对象"冻结"成字面量类型，配合联合类型，能取得枚举的大部分好处，且零运行时魔法。
const Color = {
  Red: "red",
  Green: "green",
  Blue: "blue",
} as const;

// 从对象的值推出联合类型： "red" | "green" | "blue"
type Color = (typeof Color)[keyof typeof Color];

function paint(c: Color): void {
  console.log("涂上", c);
}
paint(Color.Red); // 涂上 red
paint("blue"); // 直接传字面量也行（enum 做不到这么自然）
// paint("purple");    // ⚠️ 报错：不在联合类型里

console.log("Color 对象的所有值：", Object.values(Color)); // [ 'red', 'green', 'blue' ]

// 取舍：
// - 需要"命名的常量集合 + 想直接传字符串字面量 + 想要最小运行时" → 优先 as const 对象。
// - 团队已大量使用 enum、或需要数字自增语义、命名空间感 → 用 enum 也没问题。
// - 尽量用【字符串枚举】而非数字枚举，避开反向映射与隐式数值带来的坑。

export {};
