// 文件：code/ch06/03-builtin-errors.js
// 运行方式：node 03-builtin-errors.js
// 主题：内置错误类型 TypeError / RangeError / SyntaxError / ReferenceError 等

// 小工具：运行一段会抛错的代码，打印它的 name 与 message
function show(label, fn) {
  try {
    fn();
    console.log(`${label}：没有抛错`);
  } catch (e) {
    console.log(`${label}：${e.name} -> ${e.message}`);
  }
}

// 1) TypeError：对某个值做了它不支持的操作
show("TypeError-1", () => {
  const n = null;
  n.toString(); // 读 null 的属性
});
show("TypeError-2", () => {
  const notAFn = 42;
  notAFn(); // 把数字当函数调用
});

// 2) RangeError：数值/长度超出允许范围
show("RangeError-1", () => {
  const arr = new Array(-1); // 数组长度不能为负
});
show("RangeError-2", () => {
  (function recurse() {
    return recurse(); // 无限递归 -> 调用栈溢出
  })();
});

// 3) ReferenceError：使用了一个根本不存在的变量
show("ReferenceError", () => {
  console.log(thisVariableDoesNotExist);
});

// 4) SyntaxError：语法错误。注意它通常在“解析阶段”就抛出，
//    普通代码写错语法会让整个文件无法运行，所以我们用 JSON.parse 触发它
show("SyntaxError", () => {
  JSON.parse("{ bad json }");
});

// 5) 它们都继承自 Error
try {
  null.x;
} catch (e) {
  console.log("\nTypeError 是 Error 吗？", e instanceof Error); // true
  console.log("TypeError 是 TypeError 吗？", e instanceof TypeError); // true
  console.log("TypeError 是 RangeError 吗？", e instanceof RangeError); // false
}
