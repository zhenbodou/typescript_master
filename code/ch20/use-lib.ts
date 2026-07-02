// 文件：code/ch20/use-lib.ts
// 运行：npx tsx ch20/use-lib.ts
// 有了 legacy-math.d.ts，这里 import 纯 JS 库时能获得完整类型提示与检查。

// 命名导入 + 默认导入 + 类型导入。
import legacyMath, {
  add,
  clamp,
  randomBetween,
  formatCurrency,
  type CurrencyOptions,
} from "./legacy-math.js";

// add 的重载生效：数字相加得数字，字符串相加得字符串。
const sum: number = add(2, 3); // 走 (number, number) => number
const joined: string = add("Type", "Script"); // 走 (string, string) => string
// add(1, "x"); // 报错：没有匹配 (number, string) 的重载

// clamp：三个参数都必须是 number，返回 number。
const clamped: number = clamp(15, 0, 10); // => 10

// randomBetween：第三个参数可选。
const rndFloat: number = randomBetween(0, 1); // 不传 integer
const rndInt: number = randomBetween(1, 7, true); // 传 integer

// formatCurrency：选项对象里的字段全部有提示、且被检查。
const opts: CurrencyOptions = { currency: "USD", locale: "en-US", decimals: 2 };
const priceUSD: string = formatCurrency(1234.5, opts);
const priceCNY: string = formatCurrency(88.8); // options 可省略
// formatCurrency(100, { currency: 123 }); // 报错：currency 应为 string

// 默认导出对象同样有类型。
const viaDefault: number = legacyMath.clamp(99, 0, 100);

console.log("add(2,3) =", sum);
console.log('add("Type","Script") =', joined);
console.log("clamp(15,0,10) =", clamped);
console.log("randomBetween(0,1) =", rndFloat.toFixed(4));
console.log("randomBetween(1,7,true) =", rndInt);
console.log("formatCurrency(1234.5, USD) =", priceUSD);
console.log("formatCurrency(88.8) =", priceCNY);
console.log("legacyMath.clamp(99,0,100) =", viaDefault);
