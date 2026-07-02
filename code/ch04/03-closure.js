// 文件：code/ch04/03-closure.js
// 运行方式：node 03-closure.js
// 主题：闭包（closure）——函数记住了自己出生时的作用域

// 1) 最小闭包：内层函数引用了外层变量
function makeCounter() {
  let count = 0; // 这个变量被下面的函数"闭"住了
  return function () {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 每次调用 makeCounter 都会创建一份全新的、独立的 count
const counterA = makeCounter();
const counterB = makeCounter();
console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterB()); // 1（B 有自己的 count，和 A 互不干扰）

// 2) 用闭包实现"私有变量"：外部无法直接改 balance
function createAccount(initial) {
  let balance = initial; // 私有，外界拿不到
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log("余额不足");
        return balance;
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const acc = createAccount(100);
console.log(acc.deposit(50)); // 150
console.log(acc.withdraw(30)); // 120
console.log(acc.getBalance()); // 120
console.log(acc.balance); // undefined：没有暴露，无法直接篡改

// 3) 函数工厂：用闭包"记住"配置，批量生产定制函数
function makeMultiplier(factor) {
  return function (n) {
    return n * factor; // factor 被闭包记住
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(10)); // 20
console.log(triple(10)); // 30
