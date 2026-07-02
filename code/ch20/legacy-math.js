// 文件：code/ch20/legacy-math.js
// 这是一个「第三方」纯 JS 库：没有任何类型信息。
// 我们会在 legacy-math.d.ts 里为它补上类型声明。

// 两数相加（也支持字符串拼接：数字相加或字符串拼接，见 .d.ts 里的重载）。
export function add(a, b) {
  return a + b;
}

// 把 value 夹在 [min, max] 之间。
export function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// 返回 [min, max) 之间的随机数。可选参数 integer：为 true 时返回整数。
export function randomBetween(min, max, integer) {
  const r = Math.random() * (max - min) + min;
  return integer ? Math.floor(r) : r;
}

// 带「选项对象」的函数：把数字格式化成货币字符串。
// options: { currency?, locale?, decimals? }
export function formatCurrency(amount, options) {
  const opts = options || {};
  const currency = opts.currency || "CNY";
  const locale = opts.locale || "zh-CN";
  const decimals = opts.decimals == null ? 2 : opts.decimals;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

// 这个库还提供一个「默认导出」对象，把所有函数打包在一起。
const legacyMath = { add, clamp, randomBetween, formatCurrency };
export default legacyMath;
