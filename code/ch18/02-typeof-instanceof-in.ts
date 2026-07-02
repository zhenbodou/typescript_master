// 文件：code/ch18/02-typeof-instanceof-in.ts

// ---------- 1) typeof 收窄：适合原始类型 ----------
function double(x: number | string): number | string {
  if (typeof x === "number") {
    return x * 2; // x: number
  }
  return x.repeat(2); // x: string
}

// typeof 能识别的字符串："string" | "number" | "bigint" | "boolean"
// | "symbol" | "undefined" | "object" | "function"
function describe(x: unknown): string {
  if (typeof x === "string") return `字符串:${x}`;
  if (typeof x === "number") return `数字:${x}`;
  if (typeof x === "boolean") return `布尔:${x}`;
  if (typeof x === "function") return `函数`;
  return `其他:${String(x)}`;
}

// ---------- 2) instanceof 收窄：适合类 / 构造函数 ----------
class Dog {
  bark(): string {
    return "汪";
  }
}
class Cat {
  meow(): string {
    return "喵";
  }
}

function speak(animal: Dog | Cat): string {
  if (animal instanceof Dog) {
    return animal.bark(); // animal: Dog
  }
  return animal.meow(); // animal: Cat
}

// instanceof 对内置类同样有效
function toISO(x: Date | string): string {
  if (x instanceof Date) {
    return x.toISOString(); // x: Date
  }
  return x; // x: string
}

// ---------- 3) in 收窄：靠「属性是否存在」区分对象 ----------
type Fish = { swim: () => string };
type Bird = { fly: () => string };

function move(animal: Fish | Bird): string {
  if ("swim" in animal) {
    return animal.swim(); // animal: Fish
  }
  return animal.fly(); // animal: Bird
}

console.log(double(10), double("ab"));
console.log(describe("hi"), describe(3), describe(true), describe(() => 1));
console.log(speak(new Dog()), speak(new Cat()));
console.log(toISO(new Date("2026-07-02T00:00:00Z")), toISO("原样字符串"));
console.log(move({ swim: () => "游" }), move({ fly: () => "飞" }));
