// 文件：code/ch02/02-switch.js
// 运行方式：node 02-switch.js

// switch 适合"拿一个值去和多个固定选项比对"的场景。
// 注意：比对用的是严格相等（===），"3" 不等于 3。
const day = 3;

switch (day) {
  case 1:
    console.log("星期一");
    break;
  case 2:
    console.log("星期二");
    break;
  case 3:
    console.log("星期三");
    break;
  default:
    console.log("其他日子");
}

// ⚠️ fall-through 陷阱：忘记 break，会"穿透"到下一个 case 继续执行。
console.log("--- 忘记 break 的后果 ---");
const color = "red";
switch (color) {
  case "red":
    console.log("红色"); // 命中这里
  // 没有 break，继续往下穿透！
  case "green":
    console.log("绿色");
  case "blue":
    console.log("蓝色");
    break;
  default:
    console.log("未知颜色");
}

// 💡 有意利用 fall-through：多个 case 共享同一段逻辑。
console.log("--- 有意合并 case ---");
const month = 4;
switch (month) {
  case 3:
  case 4:
  case 5:
    console.log("春天");
    break;
  case 6:
  case 7:
  case 8:
    console.log("夏天");
    break;
  default:
    console.log("其他季节");
}
