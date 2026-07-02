// 文件：code/ch05/04-class.js
// class 语法：constructor、实例方法、字段、static、getter/setter、私有字段

class BankAccount {
  // 公有字段（class field）：可以直接写在类体里，带默认值
  owner = "未命名";

  // 私有字段（private field）：以 # 开头，只能在类内部访问
  #balance = 0;

  // 静态字段：属于类本身，不属于实例
  static bankName = "示例银行";

  // 静态私有字段：记录一共开了多少个账户
  static #count = 0;

  constructor(owner, initial = 0) {
    this.owner = owner;
    this.#balance = initial;
    BankAccount.#count++;
  }

  // 实例方法：自动挂到 BankAccount.prototype 上，所有实例共享
  deposit(amount) {
    if (amount <= 0) return this.#balance;
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (amount > this.#balance) {
      console.log("余额不足");
      return this.#balance;
    }
    this.#balance -= amount;
    return this.#balance;
  }

  // getter：像读属性一样调用，但背后是方法
  get balance() {
    return this.#balance;
  }

  // setter：像赋值一样调用，可在里面做校验
  set balance(value) {
    if (typeof value !== "number" || value < 0) {
      console.log("非法余额，已忽略");
      return;
    }
    this.#balance = value;
  }

  // 静态方法：通过类名调用，常用于工具函数或工厂
  static totalAccounts() {
    return BankAccount.#count;
  }
}

const acc = new BankAccount("Alice", 100);
console.log(acc.owner); // Alice
acc.deposit(50);
console.log(acc.balance); // 150（走的是 getter）
acc.withdraw(200); // 余额不足
acc.balance = 999; // 走 setter
console.log(acc.balance); // 999
acc.balance = -1; // 非法余额，已忽略
console.log(acc.balance); // 999

// 私有字段在外部无法访问
// console.log(acc.#balance); // ⚠️ SyntaxError

// 静态成员通过类名访问
console.log(BankAccount.bankName); // 示例银行
new BankAccount("Bob");
console.log(BankAccount.totalAccounts()); // 2

// class 只是原型的语法糖：方法确实挂在 prototype 上
console.log(typeof BankAccount.prototype.deposit); // function
console.log(Object.getPrototypeOf(acc) === BankAccount.prototype); // true

export { BankAccount };
