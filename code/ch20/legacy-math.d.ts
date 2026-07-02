// 文件：code/ch20/legacy-math.d.ts
// 为纯 JS 库 legacy-math.js 手写的「配套类型声明」。
// 文件名与 .js 同名、同目录，TS 会自动把它当作 legacy-math.js 的类型。

// formatCurrency 的「选项对象」形状，抽成一个可复用的接口。
export interface CurrencyOptions {
  /** 货币代码，如 "CNY"、"USD"、"JPY"。默认 "CNY"。 */
  currency?: string;
  /** BCP 47 语言标签，如 "zh-CN"、"en-US"。默认 "zh-CN"。 */
  locale?: string;
  /** 小数位数。默认 2。 */
  decimals?: number;
}

// 函数重载：数字 + 数字 => 数字；字符串 + 字符串 => 字符串。
export function add(a: number, b: number): number;
export function add(a: string, b: string): string;

// 普通带类型的函数声明。
export function clamp(value: number, min: number, max: number): number;

// 可选参数用 ?，末尾可省略。
export function randomBetween(min: number, max: number, integer?: boolean): number;

// 参数带「选项对象」，options 整体可选。
export function formatCurrency(amount: number, options?: CurrencyOptions): string;

// 默认导出对象的形状：把上面所有函数打包在一起。
declare const legacyMath: {
  add: typeof add;
  clamp: typeof clamp;
  randomBetween: typeof randomBetween;
  formatCurrency: typeof formatCurrency;
};
export default legacyMath;
