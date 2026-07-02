// 文件：code/ch13/08-literal-const.ts
// 字面量类型（literal type）与 as const。

// 字面量类型：类型不是"所有 string"，而是"只能是这几个具体的字符串"。
let direction: "left" | "right" | "up" | "down";
direction = "left"; // OK
// direction = "forward"; // ❌ 报错：不在允许的字面量集合里
console.log("方向：", direction);

// 为什么有用？它把"魔法字符串"变成编译器能检查的东西。
function move(dir: "left" | "right"): string {
  return `向${dir === "left" ? "左" : "右"}移动`;
}
console.log(move("left"));

// —— 类型推断里的字面量 ——
// const 声明的原始值，会被推断为"字面量类型"：
const exact = "hello"; // 类型是 "hello"，不是 string
// let 声明会被放宽为 string，因为 let 可以再赋值：
let loose = "hello"; // 类型是 string
console.log(exact, loose);

// —— as const：把整个对象/数组"冻结"成最窄的只读字面量类型 ——
const config = {
  env: "production",
  retries: 3,
} as const;
// 此时 config.env 的类型是 "production"（而不是 string），
// 且所有属性变成 readonly，不能再改。
console.log(config.env, config.retries);
// config.retries = 5; // ❌ 报错：as const 后是只读的

export {};
