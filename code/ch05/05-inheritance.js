// 文件：code/ch05/05-inheritance.js
// 继承：extends、super、方法重写、instanceof、多态

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} 发出了声音`;
  }

  describe() {
    // 注意：这里调用 this.speak()，具体是谁的 speak 由运行时的对象决定（多态）
    return `这是 ${this.name}，${this.speak()}`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // super(...) 必须在使用 this 之前调用，它执行父类构造函数
    super(name);
    this.breed = breed;
  }

  // 方法重写（override）：同名方法覆盖父类的
  speak() {
    return `${this.name}（${this.breed}）汪汪叫`;
  }

  // 在方法里用 super.xxx() 调用父类的同名方法
  describe() {
    return super.describe() + "，它是一只狗";
  }
}

class Cat extends Animal {
  speak() {
    return `${this.name} 喵喵叫`;
  }
}

const generic = new Animal("某动物");
const dog = new Dog("旺财", "柴犬");
const cat = new Cat("咪咪");

console.log(generic.speak()); // 某动物 发出了声音
console.log(dog.speak()); // 旺财（柴犬）汪汪叫
console.log(dog.describe()); // 这是 旺财，旺财（柴犬）汪汪叫，它是一只狗
console.log(cat.describe()); // 这是 咪咪，咪咪 喵喵叫

// instanceof：沿原型链检查
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true（Dog 继承自 Animal）
console.log(cat instanceof Dog); // false

// 多态（polymorphism）：同一段代码，作用在不同对象上表现不同
const zoo = [generic, dog, cat];
for (const a of zoo) {
  console.log(a.speak()); // 每个对象调用各自的 speak
}

// 原型链验证：dog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true

export { Animal, Dog, Cat };
