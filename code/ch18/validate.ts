// 文件：code/ch18/validate.ts
//
// 迷你运行时校验库（mini validator）
// ------------------------------------------------------------
// 核心思想：每个「校验器」既是运行时的检查函数，又是编译期的类型守卫。
// 校验通过时，TS 能把 unknown 精确收窄成我们想要的强类型。
// 这正是 zod / io-ts 这类库背后的原理（简化版）。

// ============================================================
// 1) 校验器的类型定义
// ============================================================
// 一个校验器接收「未知值 + 当前路径」，返回校验结果。
// path 用于在失败时给出清晰的错误位置，如 "user.roles[2]"。

export type Ok<T> = { ok: true; value: T };
export type Err = { ok: false; errors: string[] };
export type Result<T> = Ok<T> | Err;

// Validator<T>：把 unknown 校验为 T 的函数。
// 附带一个「类型标记」infer 字段，纯粹用于类型层面提取 T（运行时永远是 undefined）。
export interface Validator<T> {
  (input: unknown, path: string): Result<T>;
  // 幽灵字段：只用来在类型层面记住 T，运行时不存在。
  readonly _type?: T;
}

// 从 Validator 中「反推」出它校验的类型：Infer<typeof userSchema> === User
export type Infer<V> = V extends Validator<infer T> ? T : never;

// 小工具：构造成功 / 失败结果
const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const err = (path: string, expected: string, got: unknown): Err => ({
  ok: false,
  errors: [`${path || "<root>"}: 期望 ${expected}，实际得到 ${typeInfo(got)}`],
});

function typeInfo(x: unknown): string {
  if (x === null) return "null";
  if (Array.isArray(x)) return "array";
  return typeof x;
}

// ============================================================
// 2) 基础校验器：原始类型
// ============================================================
export const isString: Validator<string> = (input, path) =>
  typeof input === "string" ? ok(input) : err(path, "string", input);

export const isNumber: Validator<number> = (input, path) =>
  typeof input === "number" && !Number.isNaN(input)
    ? ok(input)
    : err(path, "number", input);

export const isBoolean: Validator<boolean> = (input, path) =>
  typeof input === "boolean" ? ok(input) : err(path, "boolean", input);

// ============================================================
// 3) 组合校验器：数组、可选、字面量联合
// ============================================================

// isArrayOf(item)：校验「元素都满足 item 的数组」。
// 返回类型是 Validator<T[]>，其中 T 由传入的 item 决定。
export function isArrayOf<T>(item: Validator<T>): Validator<T[]> {
  return (input, path) => {
    if (!Array.isArray(input)) return err(path, "array", input);
    const out: T[] = [];
    const errors: string[] = [];
    input.forEach((el, i) => {
      const r = item(el, `${path}[${i}]`);
      if (r.ok) out.push(r.value);
      else errors.push(...r.errors);
    });
    return errors.length ? { ok: false, errors } : ok(out);
  };
}

// optional(v)：允许该值缺失（undefined），否则按 v 校验。
export function optional<T>(v: Validator<T>): Validator<T | undefined> {
  return (input, path) =>
    input === undefined ? ok(undefined) : v(input, path);
}

// literalUnion(...values)：校验值是给定字面量之一。
// 用 <const T> 保留字面量类型，得到精确的联合类型。
export function literalUnion<const T extends readonly (string | number | boolean)[]>(
  ...values: T
): Validator<T[number]> {
  return (input, path) =>
    values.includes(input as T[number])
      ? ok(input as T[number])
      : err(path, values.map((v) => JSON.stringify(v)).join(" | "), input);
}

// ============================================================
// 4) 对象校验器：isObjectOf(schema)
// ============================================================
// schema 是一个「字段名 → 校验器」的映射。
// 我们要从这个映射「计算出」结果对象的类型，让 TS 自动推导。

// ShapeOf：把 { name: Validator<string>, age: Validator<number> }
// 映射成      { name: string; age: number }
type ShapeOf<S extends Record<string, Validator<unknown>>> = {
  [K in keyof S]: Infer<S[K]>;
};

export function isObjectOf<S extends Record<string, Validator<any>>>(
  schema: S
): Validator<ShapeOf<S>> {
  return (input, path) => {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return err(path, "object", input);
    }
    const record = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    const errors: string[] = [];
    for (const key of Object.keys(schema)) {
      const childPath = path ? `${path}.${key}` : key;
      const r = schema[key](record[key], childPath);
      if (r.ok) out[key] = r.value;
      else errors.push(...r.errors);
    }
    return errors.length
      ? { ok: false, errors }
      : ok(out as ShapeOf<S>);
  };
}

// ============================================================
// 5) 便捷入口：校验 + 断言
// ============================================================

// parse：校验成功返回强类型值，失败抛出带完整错误路径的异常。
export function parse<T>(validator: Validator<T>, input: unknown): T {
  const r = validator(input, "");
  if (r.ok) return r.value;
  throw new Error("校验失败:\n" + r.errors.map((e) => "  - " + e).join("\n"));
}

// assertValid：断言函数版本 —— 校验失败即抛，之后 input 被收窄为 T。
export function assertValid<T>(
  validator: Validator<T>,
  input: unknown
): asserts input is T {
  const r = validator(input, "");
  if (!r.ok) {
    throw new Error("校验失败:\n" + r.errors.map((e) => "  - " + e).join("\n"));
  }
}
