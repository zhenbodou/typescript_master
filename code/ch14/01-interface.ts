// 文件：code/ch14/01-interface.ts
// interface 定义对象形状：可选属性、只读属性、方法签名

interface User {
  readonly id: number; // 只读，创建后不可改
  name: string;
  age: number;
  email?: string; // 可选属性，可有可无
  greet(): string; // 方法签名
  updateAge(newAge: number): void; // 带参数的方法签名
}

const alice: User = {
  id: 1,
  name: "Alice",
  age: 30,
  greet() {
    return `你好，我叫 ${this.name}`;
  },
  updateAge(newAge) {
    this.age = newAge;
  },
};

console.log(alice.greet()); // 你好，我叫 Alice
alice.updateAge(31);
console.log("新年龄：", alice.age); // 31

console.log("email 是否存在：", alice.email ?? "（未填写）");

// alice.id = 2; // ⚠️ 取消注释会报错：Cannot assign to 'id' because it is a read-only property.

// 索引签名：允许任意字符串键，值为 number
interface StringToNumber {
  [key: string]: number;
}

const scores: StringToNumber = {};
scores["math"] = 95;
scores["english"] = 88;
console.log("数学成绩：", scores["math"]); // 95
console.log("所有分数：", scores);

export {};
