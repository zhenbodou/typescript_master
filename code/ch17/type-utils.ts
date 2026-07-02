// 文件：code/ch17/type-utils.ts
// 本章小项目：类型级工具库（type-level utility library）
// 目标：用条件类型、映射类型、模板字面量、infer、递归，做一组实用的类型工具，
// 并用自制的 Equal / Expect 断言在"类型层面"做单元测试。

// ============================================================
// 0. 类型断言工具：Equal / Expect
// ============================================================
// Equal<A, B>：当且仅当 A 与 B 完全相同时为 true。
// 这是社区（type-challenges）广泛使用的写法：利用两个泛型函数是否互相兼容来判等，
// 它比 "A extends B ? B extends A ? true : false : false" 更严格
//（能区分 any、以及 { a: 1 } 与 { readonly a: 1 } 等）。
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

// Expect<T>：只接受 true。若某个 Equal 结果是 false，这里会立刻编译报错。
type Expect<T extends true> = T;

// NotEqual：便于表达"应当不相等"
type NotEqual<A, B> = Equal<A, B> extends true ? false : true;

// ============================================================
// 1. DeepReadonly<T>：递归地把所有属性变只读
// ============================================================
type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T // 函数原样返回，不去 readonly 它的属性
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T; // 基本类型（string/number/...）到底，原样返回

// ============================================================
// 2. DeepPartial<T>：递归地把所有属性变可选
// ============================================================
type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

// ============================================================
// 3. PickByValueType<T, V>：挑出"值类型能赋给 V"的属性
// ============================================================
// 思路：用 key remapping，把值类型不匹配的键映射成 never（从而删除）。
type PickByValueType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// ============================================================
// 4. CamelCaseKeys<T>：把对象的键从 snake_case 转 camelCase
// ============================================================
type SnakeToCamel<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
    : S;

type CamelCaseKeys<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K];
};

// ============================================================
// 5. PathKeys<T> / Paths<T>：对象的"路径字面量"
// ============================================================
// 只取顶层键（string 化）
type PathKeys<T> = keyof T & string;

// Paths<T>：递归生成形如 "a" | "a.b" | "a.b.c" 的所有嵌套路径。
// ⚠️ 注意：数组也是 object，若直接递归会冒出 "tags.length"、"tags.0" 等噪声，
// 所以我们把数组（以及函数）当作"叶子"，不再往里钻。
type IsRecord<T> = T extends readonly any[]
  ? false
  : T extends (...args: any[]) => any
    ? false
    : T extends object
      ? true
      : false;

type Paths<T> = IsRecord<T> extends true
  ? {
      [K in keyof T & string]: IsRecord<T[K]> extends true
        ? K | `${K}.${Paths<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

// ============================================================
// 类型层单元测试：一行 Expect<Equal<...>> 就是一个断言
// ============================================================
interface Nested {
  id: number;
  profile: {
    name: string;
    address: { city: string };
  };
  tags: string[];
}

interface Mixed {
  id: number;
  name: string;
  active: boolean;
  score: number;
}

interface SnakeShape {
  user_name: string;
  created_at: number;
  is_admin: boolean;
}

type _tests = [
  // DeepReadonly：连嵌套对象也是 readonly
  Expect<
    Equal<
      DeepReadonly<{ a: { b: number } }>,
      { readonly a: { readonly b: number } }
    >
  >,
  // DeepPartial：嵌套属性也变可选
  Expect<
    Equal<
      DeepPartial<{ a: { b: number } }>,
      { a?: { b?: number } }
    >
  >,
  // PickByValueType：只留 number 值的属性
  Expect<
    Equal<
      PickByValueType<Mixed, number>,
      { id: number; score: number }
    >
  >,
  // PickByValueType：只留 boolean 值的属性
  Expect<Equal<PickByValueType<Mixed, boolean>, { active: boolean }>>,
  // SnakeToCamel：字符串级转换
  Expect<Equal<SnakeToCamel<"user_name">, "userName">>,
  Expect<Equal<SnakeToCamel<"created_at">, "createdAt">>,
  // CamelCaseKeys：键批量转换
  Expect<
    Equal<
      CamelCaseKeys<SnakeShape>,
      { userName: string; createdAt: number; isAdmin: boolean }
    >
  >,
  // PathKeys：顶层键
  Expect<Equal<PathKeys<Nested>, "id" | "profile" | "tags">>,
  // Paths：递归路径
  Expect<
    Equal<
      Paths<Nested>,
      | "id"
      | "tags"
      | "profile"
      | "profile.name"
      | "profile.address"
      | "profile.address.city"
    >
  >,
  // NotEqual 也能用
  Expect<NotEqual<string, number>>,
];

// 让 _tests 被"使用"，避免某些 lint 配置报未使用（tsc 本身不报，因为 noUnusedLocals=false）
type _ensure = _tests;

// ============================================================
// 运行时演示：真的构造符合类型的值，并打印"类型检查通过"
// ============================================================
const config: DeepReadonly<{ server: { port: number } }> = {
  server: { port: 8080 },
};
// config.server.port = 9090; // ❌ 若取消注释会报错：Cannot assign to 'port' because it is a read-only property

const camel: CamelCaseKeys<SnakeShape> = {
  userName: "Ada",
  createdAt: Date.now(),
  isAdmin: true,
};

const onlyNumbers: PickByValueType<Mixed, number> = { id: 1, score: 99 };

const messages = [
  `DeepReadonly 生效：server.port = ${config.server.port}`,
  `CamelCaseKeys 生效：userName = ${camel.userName}`,
  `PickByValueType 生效：id = ${onlyNumbers.id}, score = ${onlyNumbers.score}`,
];
for (const m of messages) console.log("类型检查通过：", m);

export type {
  Equal,
  Expect,
  NotEqual,
  DeepReadonly,
  DeepPartial,
  PickByValueType,
  SnakeToCamel,
  CamelCaseKeys,
  PathKeys,
  Paths,
};
