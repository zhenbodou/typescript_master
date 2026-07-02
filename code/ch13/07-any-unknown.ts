// 文件：code/ch13/07-any-unknown.ts
// 特殊类型：any（危险）、unknown（安全的 any）、never、object。

// —— any：放弃类型检查，什么都能做，等于回到裸 JS ——
let loose: any = "字符串";
loose = 42; // 不报错
// loose.foo.bar.baz; // TS 不报错，但运行时会炸！any 关掉了所有保护（故注释掉）
console.log("any 会关闭检查，很危险，尽量别用。loose =", loose);

// —— unknown：也能装任何值，但用之前必须先"缩小类型" ——
let safe: unknown = "可能是任何东西";
safe = 42;

// safe.toFixed(2); // ❌ 报错：unknown 不允许直接操作
// 必须先判断类型（type narrowing），TS 才放行：
if (typeof safe === "number") {
  console.log("是数字：", safe.toFixed(2)); // 这里 safe 已被收窄为 number
}

// —— never：表示"永远不会有值"，比如永远抛错或死循环的函数 ——
function fail(msg: string): never {
  throw new Error(msg);
}
try {
  fail("演示 never");
} catch (e) {
  console.log("捕获到：", (e as Error).message);
}

// —— object：表示"非原始值"（数组、对象、函数都算），但很少直接用 ——
const obj: object = { a: 1 };
console.log(obj);

export {};
