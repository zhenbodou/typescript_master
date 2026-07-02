// 文件：code/ch02/04-loops.js
// 运行方式：node 04-loops.js

// ---------- for 循环 ----------
// 三段式：初始化; 继续条件; 每轮结束后的更新
console.log("--- for ---");
for (let i = 1; i <= 5; i++) {
  console.log("第", i, "次");
}

// ---------- while 循环 ----------
// 先判断条件，为真才执行循环体。
console.log("--- while ---");
let count = 3;
while (count > 0) {
  console.log("倒计时", count);
  count--; // ⚠️ 忘了这句会变成死循环！
}
console.log("发射！");

// ---------- do...while 循环 ----------
// 先执行一次循环体，再判断条件。所以循环体至少跑一次。
console.log("--- do...while ---");
let m = 100;
do {
  console.log("这行至少执行一次，即使条件一开始就为假");
} while (m < 10);

// ---------- break 与 continue ----------
console.log("--- break（找到就停）---");
for (let i = 1; i <= 10; i++) {
  if (i === 4) {
    break; // 直接跳出整个循环
  }
  console.log(i);
}

console.log("--- continue（跳过本轮）---");
for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) {
    continue; // 跳过偶数，直接进入下一轮
  }
  console.log("奇数：", i);
}
