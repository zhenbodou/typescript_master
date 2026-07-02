// 文件：code/ch18/04-discriminated-union.ts

// 可辨识联合（discriminated union）：每个成员都带一个「公共字面量标签」字段。
// 这里的公共字段是 kind，取值互不相同。
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };

type Shape = Circle | Square | Rectangle;

// never 的经典用途：穷尽检查（exhaustiveness check）
function assertNever(x: never): never {
  throw new Error(`未处理的分支: ${JSON.stringify(x)}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // 这个分支里 shape 被收窄成 Circle
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // 如果上面覆盖了所有成员，走到这里 shape 的类型就是 never。
      // 一旦将来有人给 Shape 新增了成员却忘了在 switch 里处理，
      // shape 就不再是 never，下面这行会「编译报错」，逼你补上分支。
      return assertNever(shape);
  }
}

console.log("圆面积:", area({ kind: "circle", radius: 2 }).toFixed(2));
console.log("正方形面积:", area({ kind: "square", side: 3 }));
console.log(
  "矩形面积:",
  area({ kind: "rectangle", width: 4, height: 5 })
);
