// 文件：code/ch18/08-unknown-never.ts

// ---------- unknown vs any，以及 never 的用途 ----------

// any：彻底关闭检查。下面全部「编译通过」，但运行时会炸。
function withAny(x: any): void {
  x.foo.bar.baz; // 编译不拦
  x(); // 编译不拦
}

// unknown：安全的顶层类型。可以「接收任何值」，但用之前必须先收窄。
function withUnknown(x: unknown): void {
  // x.foo;            // ❌ 报错：对象类型未知
  // x();              // ❌ 报错：不确定能不能调用
  if (typeof x === "object" && x !== null && "foo" in x) {
    console.log("收窄后可安全访问:", (x as { foo: unknown }).foo);
  }
}

// 处理外部数据（如 JSON.parse）时，unknown 是最佳落点。
function parseConfig(json: string): { port: number } {
  const data: unknown = JSON.parse(json); // 不要用 any！
  if (
    typeof data === "object" &&
    data !== null &&
    "port" in data &&
    typeof (data as Record<string, unknown>).port === "number"
  ) {
    return { port: (data as { port: number }).port };
  }
  throw new Error("配置格式不合法");
}

// never：「不可能存在的值」的类型。
// 用途 1：永不返回的函数（总是抛错或死循环）。
function fail(msg: string): never {
  throw new Error(msg);
}

// 用途 2：穷尽检查（见 04 章示例的 assertNever）。
// 用途 3：表示「空联合」——某个类型经过收窄后一个成员都不剩，就是 never。
function impossible(x: string & number): void {
  // string & number 没有任何公共值 → x: never
  console.log(x); // 这行永远不会真正执行到有意义的值
}

withUnknown({ foo: 42 });
console.log("parseConfig:", parseConfig('{"port":8080}'));
try {
  parseConfig('{"port":"oops"}');
} catch (e) {
  console.log("捕获:", (e as Error).message);
}

// 避免未使用告警：演示引用一下（不实际调用会抛错/无意义的函数）
void withAny;
void fail;
void impossible;
