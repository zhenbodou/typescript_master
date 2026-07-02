// 文件：code/ch18/05-type-predicate.ts

// ---------- 用户自定义类型守卫（type predicate）：返回值写 `x is T` ----------

// 普通的布尔函数：TS 只知道它返回 boolean，不会用它来收窄类型。
function isStringPlain(x: unknown): boolean {
  return typeof x === "string";
}

// 类型守卫：返回值类型写成 `x is string`。
// 当它返回 true 时，TS 就把实参收窄为 string。
function isString(x: unknown): x is string {
  return typeof x === "string";
}

function demo(value: unknown): void {
  if (isStringPlain(value)) {
    // ⚠️ value 仍然是 unknown，下面这行会报错（已注释）
    // value.toUpperCase();
    console.log("isStringPlain 判定为字符串，但类型没有收窄");
  }

  if (isString(value)) {
    // ✅ 这里 value 被收窄为 string
    console.log("收窄为 string:", value.toUpperCase());
  }
}

// 更常见的场景：给自定义对象写类型守卫
interface User {
  id: number;
  name: string;
}

function isUser(x: unknown): x is User {
  // 注意：函数体里要真的把「所有必要条件」都检查到，
  // 否则守卫在「撒谎」——运行时和类型会脱节。
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as Record<string, unknown>).id === "number" &&
    typeof (x as Record<string, unknown>).name === "string"
  );
}

// filter + 类型守卫：把 (T | null)[] 过滤成 T[]
function isNotNull<T>(x: T | null): x is T {
  return x !== null;
}

const raw: (User | null)[] = [
  { id: 1, name: "Alice" },
  null,
  { id: 2, name: "Bob" },
];

// 不用守卫时，filter(Boolean) 的结果仍是 (User | null)[]；
// 用了 isNotNull 后，users 精确地是 User[]。
const users: User[] = raw.filter(isNotNull);

demo("hello");
demo(123);
console.log("isUser 合法对象:", isUser({ id: 9, name: "X" }));
console.log("isUser 缺字段:", isUser({ id: 9 }));
console.log(
  "过滤后的用户:",
  users.map((u) => u.name)
);
