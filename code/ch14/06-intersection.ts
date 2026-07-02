// 文件：code/ch14/06-intersection.ts
// 交叉类型（intersection）A & B：把多个类型"合并"成一个

type WithId = { id: number };
type WithName = { name: string };
type WithTimestamps = { createdAt: Date; updatedAt: Date };

// 交叉：同时拥有全部三组属性
type Entity = WithId & WithName & WithTimestamps;

const user: Entity = {
  id: 1,
  name: "Alice",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-07-01"),
};
console.log(`#${user.id} ${user.name}`);

// 常见用法：给已有类型"追加"字段（Mixin 风格）
type Serializable = { toJSON(): string };
type Loggable = { log(): void };

type Model = WithId & Serializable & Loggable;

const model: Model = {
  id: 42,
  toJSON() {
    return JSON.stringify({ id: this.id });
  },
  log() {
    console.log("Model:", this.toJSON());
  },
};
model.log(); // Model: {"id":42}

// ⚠️ 交叉冲突：若两边同名属性类型不兼容，结果类型会变成 never（无法赋值）
type A = { kind: "a" };
type B = { kind: "b" };
type Impossible = A & B; // kind 同时要是 "a" 又要是 "b" → never
// const imp: Impossible = { kind: "a" }; // 报错：无论填什么都不满足
console.log("交叉演示完成");
// 用一个 typeof 断言表明 Impossible 的 kind 已坍缩为 never
type KindType = Impossible["kind"]; // never
const _check: KindType extends never ? true : false = true;
console.log("Impossible.kind is never:", _check);

export {};
