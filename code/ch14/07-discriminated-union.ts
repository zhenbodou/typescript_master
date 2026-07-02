// 文件：code/ch14/07-discriminated-union.ts
// 可辨识联合（discriminated union）：TS 建模的利器

// 每个成员都有一个公共的字面量"标签"字段 kind
interface Circle {
  kind: "circle";
  radius: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

// 用 switch 对 kind 收窄，每个分支里 shape 的类型被精确确定
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // 这里 shape 被收窄为 Circle，可以安全访问 radius
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default: {
      // 完全穷尽检查（exhaustiveness）：若上面漏了某个成员，
      // shape 在这里就不是 never，赋值会报错，编译期就能发现遗漏
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

const shapes: Shape[] = [
  { kind: "circle", radius: 2 },
  { kind: "rectangle", width: 3, height: 4 },
  { kind: "triangle", base: 6, height: 8 },
];

for (const s of shapes) {
  console.log(`${s.kind} 面积 = ${area(s).toFixed(2)}`);
}

// 用 in 操作符收窄（当没有统一标签字段时）
type Fish = { swim: () => void };
type Bird = { fly: () => void };
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // 收窄为 Fish
  } else {
    animal.fly(); // 收窄为 Bird
  }
}
move({ swim: () => console.log("游泳") });
move({ fly: () => console.log("飞行") });

export {};
