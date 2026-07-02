// 文件：code/ch15/02-overload.ts
// 函数重载（function overload）：多个"签名"共用一个"实现"。
// 运行：npx tsx ch15/02-overload.ts

// ---------- 重载：一个函数，随参数不同而有不同的返回类型 ----------
// 前面几行是「重载签名」（只有签名，没有函数体），对外可见。
export function reverse(value: string): string;
export function reverse<T>(value: T[]): T[];
// 最后一行是「实现签名」（带函数体），对外【不可见】，只负责真正干活。
// 实现签名的参数/返回类型必须"兼容"上面所有重载签名。
export function reverse(value: string | unknown[]): string | unknown[] {
  if (typeof value === "string") {
    return value.split("").reverse().join("");
  }
  return value.slice().reverse();
}

// 传字符串 → 返回类型被推断为 string
const s = reverse("hello");
console.log(s.toUpperCase()); // OLLEH —— s 是 string，能调 toUpperCase

// 传数组 → 返回类型被推断为 number[]
const a = reverse([1, 2, 3]);
console.log(a.map((n) => n + 1)); // [ 4, 3, 2 ] —— a 是 number[]，能调 map

// ⚠️ 下面这行会报错：没有一个重载签名匹配 (number)。实现签名对外不可见！
// reverse(123);

// ---------- 用重载表达"参数组合的约束" ----------
// 例：makeDate 要么传 1 个时间戳，要么传 年/月/日 三个数，不允许传 2 个。
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;
function makeDate(a: number, b?: number, c?: number): Date {
  if (b !== undefined && c !== undefined) {
    return new Date(a, b - 1, c); // 月份从 0 开始，所以 b-1
  }
  return new Date(a);
}

console.log(makeDate(0).getUTCFullYear()); // 1970
const d = makeDate(2026, 7, 2); // 用"年/月/日"三参重载，得到本地时间 2026-07-02
console.log(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`); // 2026-7-2
// makeDate(2026, 7); // ⚠️ 报错：没有接收 2 个参数的重载
