// 文件：code/ch14/04-type-alias.ts
// type 类型别名：不止能命名对象，还能命名任意类型

// 1) 给基础/组合类型起别名
type ID = number | string; // 联合类型别名
type Point = { x: number; y: number }; // 对象类型别名
type Pair<T> = [T, T]; // 元组类型别名（带泛型，第 19 章细讲）

const userId: ID = "u_123";
const origin: Point = { x: 0, y: 0 };
const coords: Pair<number> = [3, 4];
console.log(userId, origin, coords);

// 2) type 也能用 & 做"类似继承"的扩展
type Animal = { name: string };
type Dog = Animal & { breed: string }; // 交叉，等价于接口的 extends
const d: Dog = { name: "旺财", breed: "柴犬" };
console.log(`${d.name} 是一只 ${d.breed}`);

// 3) interface 能做而 type 用别的写法做的：合并
// 而 type 能做 interface 做不到的：给"非对象"类型命名
type Direction = "up" | "down" | "left" | "right"; // 只能是这四个字符串之一
type Handler = (e: string) => void; // 函数类型
type ReadonlyPoint = Readonly<Point>; // 基于已有类型变换

const move: Direction = "up";
const onClick: Handler = (e) => console.log("事件：", e);
const rp: ReadonlyPoint = { x: 1, y: 2 };
console.log(move);
onClick("click");
console.log(rp);
// rp.x = 5; // ⚠️ 报错：Readonly 使属性只读

export {};
