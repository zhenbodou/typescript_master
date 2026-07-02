// 文件：code/ch15/03-class-basics.ts
// TS 中的类：字段类型、访问修饰符、readonly、参数属性、static、getter/setter。
// 运行：npx tsx ch15/03-class-basics.ts

class BankAccount {
  // 字段类型注解 + 访问修饰符
  public readonly owner: string; // public：默认，任何地方可读；readonly：初始化后不可改
  private _balance: number; // private：只有 BankAccount 内部能访问
  protected currency: string; // protected：本类 + 子类内部能访问
  static bankName = "TS 银行"; // static：属于"类"本身，而非某个实例

  constructor(owner: string, initial: number, currency = "CNY") {
    this.owner = owner;
    this._balance = initial;
    this.currency = currency;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("存款必须为正数");
    this._balance += amount;
  }

  // getter：像读属性一样访问 account.balance，实际执行方法
  get balance(): number {
    return this._balance;
  }

  // setter：像赋值一样 account.balance = x，实际执行方法（这里做校验）
  set balance(value: number) {
    if (value < 0) throw new Error("余额不能为负");
    this._balance = value;
  }

  // static 方法：通过类名调用，不依赖某个实例
  static describe(): string {
    return `欢迎使用 ${BankAccount.bankName}`;
  }
}

const acc = new BankAccount("阿伟", 100);
acc.deposit(50);
console.log(acc.owner, "余额：", acc.balance); // 阿伟 余额： 150（走 getter）
acc.balance = 200; // 走 setter（含校验）
console.log("改后余额：", acc.balance); // 200
console.log(BankAccount.describe()); // 欢迎使用 TS 银行（static 方法，用类名调）

// acc.owner = "别人";   // ⚠️ 报错：owner 是 readonly
// acc._balance = 999;   // ⚠️ 报错：_balance 是 private，外部不可访问
// acc.balance = -1;     // 运行时抛错：余额不能为负

// ---------- 参数属性（parameter properties）：构造函数里的简写 ----------
// 在构造函数参数前加修饰符（public/private/protected/readonly），
// TS 会自动声明同名字段并把参数赋值给它，省掉重复的样板代码。
class Point3D {
  // 等价于：声明 x/y/z 三个字段 + 在构造体里 this.x = x 等
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {}

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
}

const v = new Point3D(2, 3, 6);
console.log("向量长度：", v.length()); // 7

export {};
