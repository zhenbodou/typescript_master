// 文件：code/ch05/02-prototype.js
// 原型（prototype）与原型链（prototype chain）

// 1) 用 Object.create 显式指定一个对象的原型
const animal = {
  eats: true,
  walk() {
    return `${this.name} 正在走路`;
  },
};

// rabbit 的原型是 animal
const rabbit = Object.create(animal);
rabbit.name = "兔子";
rabbit.jumps = true;

console.log(rabbit.name); // 兔子（自己的属性）
console.log(rabbit.jumps); // true（自己的属性）
console.log(rabbit.eats); // true（自己没有，沿原型链在 animal 上找到）
console.log(rabbit.walk()); // 兔子 正在走路（walk 来自 animal，但 this 是 rabbit）

// 2) 查看/获取一个对象的原型
console.log(Object.getPrototypeOf(rabbit) === animal); // true
console.log(rabbit.__proto__ === animal); // true（等价，但 __proto__ 不推荐在代码里用）

// 3) 原型链是多层的：longEar -> rabbit -> animal -> Object.prototype -> null
const longEar = Object.create(rabbit);
longEar.name = "长耳兔";
console.log(longEar.eats); // true（跨了两层：longEar 没有 -> rabbit 没有 -> animal 有）

// 4) hasOwnProperty：只看"自己身上"有没有，不看原型链
console.log(rabbit.hasOwnProperty("name")); // true（自己的）
console.log(rabbit.hasOwnProperty("eats")); // false（继承来的，不算自己的）

// 5) in 运算符：会连原型链一起看
console.log("eats" in rabbit); // true

// 6) 属性遮蔽（shadowing）：给自己加同名属性，不会改到原型
rabbit.eats = false; // 在 rabbit 自己身上新建了 eats
console.log(rabbit.eats); // false（自己的遮蔽了原型的）
console.log(animal.eats); // true（原型没被改动）

export { animal, rabbit };
