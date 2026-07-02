// 文件：code/ch18/01-why-narrowing.ts

// 一个联合类型的参数：id 可能是数字，也可能是字符串。
function formatId(id: number | string): string {
  // 此时 id 的类型是 number | string，
  // 直接调用 .toFixed()（只有 number 有）会报错，
  // 直接调用 .toUpperCase()（只有 string 有）也会报错。
  // id.toFixed(2);    // ❌ 报错：string 上没有 toFixed
  // id.toUpperCase(); // ❌ 报错：number 上没有 toUpperCase

  // 必须先「收窄」到某一个具体类型，才能安全使用它专属的方法。
  if (typeof id === "number") {
    // 这个分支里，TS 知道 id 一定是 number
    return `#${id.toFixed(0)}`;
  } else {
    // 排除了 number，剩下只能是 string
    return `#${id.toUpperCase()}`;
  }
}

console.log(formatId(42)); // #42
console.log(formatId("abc")); // #ABC
