// 文件：code/ch05/shapes.js
// 本章小项目：几何图形库
// 基类 Shape，派生 Circle / Rectangle / Square / Triangle
// 每个图形实现 area()、perimeter()、toString()
// 用数组装各种图形，遍历打印并求总面积，体现多态

// ===== 基类 =====
class Shape {
  // 私有字段：给每个图形一个名字，外部只读
  #name;

  constructor(name) {
    // Shape 是抽象基类，不应被直接实例化
    if (new.target === Shape) {
      throw new Error("Shape 是抽象基类，不能直接实例化，请使用其子类。");
    }
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  // 基类不知道具体怎么算，交给子类实现（抽象方法的模拟）
  area() {
    throw new Error(`${this.name} 未实现 area() 方法`);
  }

  perimeter() {
    throw new Error(`${this.name} 未实现 perimeter() 方法`);
  }

  // 通用的 toString：调用 this.area()/this.perimeter()，
  // 具体算法由运行时对象决定 —— 这就是多态
  toString() {
    return `${this.name}｜面积=${this.area().toFixed(2)}｜周长=${this.perimeter().toFixed(2)}`;
  }
}

// ===== 圆 =====
class Circle extends Shape {
  #radius;

  constructor(radius) {
    super("圆");
    this.#radius = radius;
  }

  get radius() {
    return this.#radius;
  }

  area() {
    return Math.PI * this.#radius ** 2;
  }

  perimeter() {
    return 2 * Math.PI * this.#radius;
  }
}

// ===== 矩形 =====
class Rectangle extends Shape {
  #width;
  #height;

  // 允许子类（正方形）传入自定义名字
  constructor(width, height, name = "矩形") {
    super(name);
    this.#width = width;
    this.#height = height;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  area() {
    return this.#width * this.#height;
  }

  perimeter() {
    return 2 * (this.#width + this.#height);
  }
}

// ===== 正方形：继承自矩形（正方形是宽高相等的矩形）=====
class Square extends Rectangle {
  constructor(side) {
    // 复用 Rectangle 的构造：宽高都传 side，并改名字
    super(side, side, "正方形");
  }

  get side() {
    return this.width; // 复用父类的 getter
  }
}

// ===== 三角形（用三边长，海伦公式算面积）=====
class Triangle extends Shape {
  #a;
  #b;
  #c;

  constructor(a, b, c) {
    super("三角形");
    // 校验能否构成三角形：任意两边之和大于第三边
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new Error(`边长 ${a}, ${b}, ${c} 无法构成三角形`);
    }
    this.#a = a;
    this.#b = b;
    this.#c = c;
  }

  perimeter() {
    return this.#a + this.#b + this.#c;
  }

  area() {
    // 海伦公式：s 为半周长，面积 = √(s(s-a)(s-b)(s-c))
    const s = this.perimeter() / 2;
    return Math.sqrt(s * (s - this.#a) * (s - this.#b) * (s - this.#c));
  }
}

// ===== 使用：把不同图形放进一个数组，多态遍历 =====
const shapes = [
  new Circle(5),
  new Rectangle(4, 6),
  new Square(3),
  new Triangle(3, 4, 5),
];

console.log("=== 图形清单 ===");
for (const shape of shapes) {
  // 同一行代码 shape.toString()，每个图形算法不同 —— 多态
  console.log(shape.toString());
}

// 求总面积：reduce 把每个图形的面积累加起来
const totalArea = shapes.reduce((sum, shape) => sum + shape.area(), 0);
console.log("=== 汇总 ===");
console.log(`图形数量：${shapes.length}`);
console.log(`总面积：${totalArea.toFixed(2)}`);

// 找出面积最大的图形
const biggest = shapes.reduce((max, s) => (s.area() > max.area() ? s : max));
console.log(`面积最大的是：${biggest.name}（${biggest.area().toFixed(2)}）`);

export { Shape, Circle, Rectangle, Square, Triangle };
