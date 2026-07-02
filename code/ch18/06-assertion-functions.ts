// 文件：code/ch18/06-assertion-functions.ts

// ---------- 断言函数（assertion function）：返回 void，但用 `asserts` 修饰 ----------

// 形式一：asserts condition —— 断言「某个布尔条件成立」。
// 如果条件为假就抛错；一旦函数正常返回，TS 认为条件之后一直成立。
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function useAssert(x: string | null): string {
  assert(x !== null, "x 不应为 null");
  // 上面这行之后，TS 知道 x !== null 恒成立 → x: string
  return x.toUpperCase();
}

// 形式二：asserts x is T —— 断言「参数就是某个类型」。
// 常用于把 unknown 断言成具体类型，失败即抛错。
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") {
    throw new Error(`期望 string，实际是 ${typeof x}`);
  }
}

function useAssertIsString(input: unknown): number {
  assertIsString(input);
  // 断言之后 input: string
  return input.length;
}

// 断言函数 vs 类型守卫的区别：
// - 类型守卫 (x is T) 返回布尔，交给「你自己」用 if 分流。
// - 断言函数 (asserts x is T) 不返回布尔，「不满足就直接抛」，之后代码默认成立。

console.log(useAssert("hi")); // HI
console.log(useAssertIsString("hello")); // 5

try {
  useAssert(null); // 抛错
} catch (e) {
  console.log("捕获:", (e as Error).message);
}

try {
  useAssertIsString(123); // 抛错
} catch (e) {
  console.log("捕获:", (e as Error).message);
}
