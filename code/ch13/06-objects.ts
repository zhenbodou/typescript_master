// 文件：code/ch13/06-objects.ts
// 对象类型：内联对象注解、可选属性、readonly。

// 内联对象类型注解：直接在冒号后面描述对象的"形状"。
const user: { id: number; name: string; email?: string } = {
  id: 1,
  name: "小明",
  // email 是可选属性（?），可以不写。
};
console.log(user.name);

// 因为 email 可能不存在，直接用会被 TS 提醒它是 string | undefined。
if (user.email) {
  console.log(user.email.toLowerCase());
} else {
  console.log("这个用户没有邮箱");
}

// readonly：只读属性，赋值后不能再改（编译期检查）。
type Point = { readonly x: number; readonly y: number };
const origin: Point = { x: 0, y: 0 };
console.log(origin.x, origin.y);
// origin.x = 10; // ❌ 报错：Cannot assign to 'x' because it is a read-only property.

// 函数参数也能用内联对象类型，常用于"配置对象"。
function describe(p: { x: number; y: number }): string {
  return `(${p.x}, ${p.y})`;
}
console.log(describe({ x: 3, y: 4 }));

export {};
