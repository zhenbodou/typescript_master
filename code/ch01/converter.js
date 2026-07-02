// 文件：code/ch01/converter.js
// 单位/汇率换算器 —— 第 1 章小项目
// 运行方式（默认示例）：node converter.js
// 运行方式（命令行参数）：
//   node converter.js c2f 100      -> 摄氏 100 度转华氏
//   node converter.js f2c 212      -> 华氏 212 度转摄氏
//   node converter.js usd2cny 20   -> 20 美元转人民币
//   node converter.js cny2usd 145  -> 145 人民币转美元

// ===== 1. 固定配置（用 const，因为这些"标准"不该被程序中途改掉）=====
const USD_TO_CNY = 7.25; // 假设 1 美元 = 7.25 人民币（示例用固定汇率）

// ===== 2. 四个换算公式，各写成一句表达式 =====
// 摄氏 -> 华氏： F = C × 9/5 + 32
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}
// 华氏 -> 摄氏： C = (F − 32) × 5/9
function fahrenheitToCelsius(f) {
  return ((f - 32) * 5) / 9;
}
// 美元 -> 人民币
function usdToCny(usd) {
  return usd * USD_TO_CNY;
}
// 人民币 -> 美元
function cnyToUsd(cny) {
  return cny / USD_TO_CNY;
}

// 把数字保留两位小数，返回字符串（便于展示金额/温度）
function round2(n) {
  return n.toFixed(2);
}

// ===== 3. 读取命令行参数 =====
// process.argv 是一个数组：
//   [0] node 可执行文件路径
//   [1] 当前脚本路径
//   [2] 起才是我们真正传的参数
const op = process.argv[2]; // 操作类型，如 "c2f"
const rawValue = process.argv[3]; // 数值（此时还是字符串！）

// ===== 4. 没给参数时，跑几个内置示例（对零基础最友好）=====
if (op === undefined) {
  console.log("=== 单位 / 汇率换算器（示例演示）===");
  console.log(`摄氏 100°C = 华氏 ${round2(celsiusToFahrenheit(100))}°F`);
  console.log(`华氏 212°F = 摄氏 ${round2(fahrenheitToCelsius(212))}°C`);
  console.log(`20 美元   = ${round2(usdToCny(20))} 人民币`);
  console.log(`145 人民币 = ${round2(cnyToUsd(145))} 美元`);
  console.log("");
  console.log("想自己算？试试：node converter.js c2f 37");
} else {
  // ===== 5. 给了参数：先把字符串转成数字并校验 =====
  const value = Number(rawValue); // 关键：命令行参数永远是字符串，必须转

  if (Number.isNaN(value)) {
    console.log(`⚠️ "${rawValue}" 不是一个有效数字。`);
  } else {
    // 用一串三元/判断根据 op 选择公式
    let output;
    if (op === "c2f") {
      output = `摄氏 ${value}°C = 华氏 ${round2(celsiusToFahrenheit(value))}°F`;
    } else if (op === "f2c") {
      output = `华氏 ${value}°F = 摄氏 ${round2(fahrenheitToCelsius(value))}°C`;
    } else if (op === "usd2cny") {
      output = `${value} 美元 = ${round2(usdToCny(value))} 人民币`;
    } else if (op === "cny2usd") {
      output = `${value} 人民币 = ${round2(cnyToUsd(value))} 美元`;
    } else {
      output = `⚠️ 不认识的操作 "${op}"。可用：c2f / f2c / usd2cny / cny2usd`;
    }
    console.log(output);
  }
}
