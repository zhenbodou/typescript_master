// 文件：code/ch16/04-default-and-shapes.ts
// 泛型默认值、泛型接口、泛型类型别名、泛型类。

// 1) 泛型默认值：不指定时 T 默认为 string。
interface Box<T = string> {
  value: T;
}
const b1: Box = { value: "默认就是 string" }; // T 用默认值 string
const b2: Box<number> = { value: 123 }; // 显式指定 number

// 2) 泛型接口：描述「可以装任意类型」的容器。
interface Container<T> {
  items: T[];
  add(item: T): void;
  get(index: number): T | undefined;
}

// 3) 泛型类型别名：Result 表示「成功或失败」二选一。
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseIntSafe(s: string): Result<number> {
  const n = Number(s);
  if (Number.isNaN(n)) {
    return { ok: false, error: new Error(`不是合法数字: ${s}`) };
  }
  return { ok: true, value: n };
}

// 4) 泛型类：Stack<T> 是一个类型安全的栈。
class Stack<T> {
  private data: T[] = [];
  push(item: T): void {
    this.data.push(item);
  }
  pop(): T | undefined {
    return this.data.pop();
  }
  get size(): number {
    return this.data.length;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
const top = numStack.pop(); // number | undefined

console.log("Box 默认:", b1, "Box<number>:", b2);

const r1 = parseIntSafe("42");
const r2 = parseIntSafe("abc");
// 用「可辨识联合」的 ok 字段收窄类型：
if (r1.ok) console.log("解析成功:", r1.value);
if (!r2.ok) console.log("解析失败:", r2.error.message);

console.log("栈顶:", top, "剩余大小:", numStack.size);

export {};
