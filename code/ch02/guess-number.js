// 文件：code/ch02/guess-number.js
// 运行方式：node guess-number.js
//
// 命令行猜数字游戏：程序随机生成一个 1~100 的整数，
// 你在终端里输入猜测，程序提示"大了/小了"，猜中为止，并统计次数。

// 从 Node 内置模块引入 readline 的 Promise 版本。
// 我们用它把终端输入变成一个"可以逐行 await 的数据流"。
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// 生成 [min, max] 闭区间内的随机整数。
function randomInt(min, max) {
  // Math.random() 返回 [0, 1) 的小数；下面这行把它映射到整数区间。
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 判断一次猜测的结果，返回一个描述字符串。
function judge(guess, answer) {
  if (guess > answer) {
    return "high"; // 猜大了
  } else if (guess < answer) {
    return "low"; // 猜小了
  } else {
    return "correct"; // 猜中了
  }
}

// 把整个游戏流程包在一个 async 函数里，
// 这样内部就能用 await / for await 逐行等待用户输入。
async function main() {
  const answer = randomInt(1, 100);
  let count = 0; // 记录有效猜测次数

  // 创建 readline 接口，负责从终端读一行、往终端写一行。
  const rl = readline.createInterface({ input, output });

  console.log("我想好了一个 1~100 的整数，来猜猜看吧！");
  output.write("请输入你的猜测："); // 先手动打印一次提示

  // for await...of 会逐行读取输入：每当你输入一行并回车，
  // 循环体就拿到那一行文本 line。它在交互和管道输入下都稳定工作。
  for await (const line of rl) {
    const guess = Number(line.trim()); // 输入是字符串，去空白后转成数字

    // 输入校验：不是 1~100 的整数就提示重来（这一轮不计数）。
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      console.log("请输入 1~100 之间的整数哦～");
      output.write("请输入你的猜测：");
      continue; // 跳过本轮剩余逻辑，等待下一行输入
    }

    count++; // 有效猜测，次数 +1

    const result = judge(guess, answer);
    if (result === "high") {
      console.log("大了！再小一点～");
    } else if (result === "low") {
      console.log("小了！再大一点～");
    } else {
      console.log(`🎉 猜中了！答案就是 ${answer}，你一共猜了 ${count} 次。`);
      break; // 跳出循环，游戏结束
    }

    output.write("请输入你的猜测："); // 打印下一轮提示
  }

  // 关闭接口，否则程序不会自动退出。
  rl.close();
}

// 启动游戏。
main();
