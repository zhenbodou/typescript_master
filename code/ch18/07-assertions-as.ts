// 文件：code/ch18/07-assertions-as.ts

// ---------- 类型断言 as / as const / 非空断言 ! / 双重断言 ----------

// 1) as：告诉编译器「相信我，它就是这个类型」。不做任何运行时检查！
const el = { tagName: "INPUT" } as { tagName: string; value: string };
// 编译期 el.value 合法，但运行时 el 里根本没有 value → 得到 undefined
console.log("as 断言（危险）:", el.value); // undefined

// as 只能在「有交集」的类型间转换，完全无关的类型会被拒绝：
// const n = "abc" as number; // ❌ 报错：string 与 number 无重叠

// 2) 双重断言 as unknown as T：强行绕过上面的限制（几乎总是坏味道）。
const forced = "abc" as unknown as number;
console.log("双重断言（更危险）:", forced, typeof forced); // 运行时还是 string！

// 3) as const：把字面量「锁死」为最窄的只读类型。
let a = "GET"; // 推断为 string
const b = "GET"; // 推断为 "GET"（字面量类型）
const config = {
  method: "GET",
  retries: 3,
} as const;
// config.method 的类型是 "GET"（不是 string），且整个对象只读
// config.retries = 5; // ❌ 报错：只读

const roles = ["admin", "guest"] as const;
// roles 的类型是 readonly ["admin", "guest"]，可用来派生联合类型
type Role = (typeof roles)[number]; // "admin" | "guest"

// 4) 非空断言 !：断言「这个值一定不是 null / undefined」。同样不做运行时检查。
function findUser(id: number): { id: number } | undefined {
  return id > 0 ? { id } : undefined;
}
const u = findUser(1)!; // 断言结果非空 → u: { id: number }
console.log("非空断言:", u.id);

// ⚠️ 若断言错了，运行时就会「炸得莫名其妙」：
const maybe = findUser(-1)!; // 类型上是 { id: number }，运行时其实是 undefined
try {
  console.log(maybe.id); // TypeError: Cannot read properties of undefined
} catch (e) {
  console.log("非空断言的雷:", (e as Error).message);
}

console.log("as const:", a, b, config.method, roles.join("/"));
const r: Role = "admin";
console.log("派生联合:", r);
