// 文件：code/ch19/05-reflect-and-defineproperty.ts
// 演示：元编程的两块基石——Object.defineProperty 与 Reflect。

// 1) Object.defineProperty：精细控制一个属性的"特性"（descriptor）。
const config: Record<string, unknown> = {};
Object.defineProperty(config, "version", {
  value: "1.0.0",
  writable: false, // 只读
  enumerable: true, // 可被 for...in / Object.keys 枚举
  configurable: false, // 不可删除、不可再次重定义
});
console.log("version =", config.version);
try {
  // 模块顶层代码在 ESM 里默认是严格模式，给只读属性赋值会抛错。
  config.version = "9.9.9";
} catch (e) {
  console.log("修改只读属性被拒绝:", (e as Error).message);
}
console.log("尝试修改后 version =", config.version); // 仍是 1.0.0

// 定义一个"计算属性"（访问器属性）
const rect = { width: 3, height: 4 };
Object.defineProperty(rect, "area", {
  get() {
    return (this as typeof rect).width * (this as typeof rect).height;
  },
  enumerable: true,
});
console.log("area =", (rect as any).area); // 12

// 2) Reflect：把"语言内部操作"变成可调用的函数，与 Proxy 天生一对。
const user = { name: "Alice", age: 30 };

console.log("Reflect.get:", Reflect.get(user, "name")); // 等价于 user.name
Reflect.set(user, "age", 31); // 等价于 user.age = 31
console.log("修改后 age:", user.age);
console.log("Reflect.has:", Reflect.has(user, "name")); // 等价于 "name" in user
console.log("Reflect.ownKeys:", Reflect.ownKeys(user)); // 拿到自有键（含 Symbol）
Reflect.deleteProperty(user, "age"); // 等价于 delete user.age
console.log("删除后:", user);

// Reflect.get / set 支持第三个参数 receiver，用于在继承链上正确传递 this。
const base = {
  _x: 1,
  get x() {
    return this._x;
  },
};
const child = { _x: 42 };
console.log("带 receiver 的 get:", Reflect.get(base, "x", child)); // 42，用 child 当 this
