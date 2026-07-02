// 文件：code/ch17/05-template-literal.ts
// 模板字面量类型（template literal types）

// 基本：把字面量类型拼进模板字符串
type Greeting = `Hello, ${string}`;
const g1: Greeting = "Hello, world"; // ✅
// const g2: Greeting = "Hi";        // ❌ 不匹配

// 和联合类型结合会"分发"，做笛卡尔积
type Lang = "zh" | "en";
type Kind = "title" | "body";
type Key = `${Lang}_${Kind}`;
// "zh_title" | "zh_body" | "en_title" | "en_body"

// 内置字符串工具类型：Uppercase / Lowercase / Capitalize / Uncapitalize
type U = Uppercase<"hello">; // "HELLO"
type L = Lowercase<"HELLO">; // "hello"
type Cap = Capitalize<"hello">; // "Hello"
type Unc = Uncapitalize<"Hello">; // "hello"

// 从事件名生成"处理器名"：click -> onClick
type EventName = "click" | "focus" | "blur";
type Handlers = {
  [E in EventName as `on${Capitalize<E>}`]: () => void;
};
// { onClick: () => void; onFocus: () => void; onBlur: () => void }

// 用 infer 配合模板字面量，从字符串里"提取"部分
// 提取 "user/123" 里的 id 部分
type ExtractId<S> = S extends `user/${infer Id}` ? Id : never;
type Id1 = ExtractId<"user/123">; // "123"
type Id2 = ExtractId<"post/1">; // never

// 把 snake_case 转 camelCase（递归 + 模板 + infer）
type SnakeToCamel<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
    : S;
type C1 = SnakeToCamel<"user_name">; // "userName"
type C2 = SnakeToCamel<"first_name_last">; // "firstNameLast"
type C3 = SnakeToCamel<"id">; // "id"

// 运行时演示：类型与真实值对齐
const handlers: Handlers = {
  onClick: () => console.log("click"),
  onFocus: () => console.log("focus"),
  onBlur: () => console.log("blur"),
};
handlers.onClick();
const camel: SnakeToCamel<"user_name"> = "userName";
console.log("类型检查通过：SnakeToCamel<'user_name'> =", camel);

export type {
  Greeting,
  Key,
  U,
  L,
  Cap,
  Unc,
  Handlers,
  Id1,
  Id2,
  C1,
  C2,
  C3,
};
export { };
