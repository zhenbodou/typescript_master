// 文件：code/ch01/03-strings.js
// 运行方式：node 03-strings.js

const name = "小明";
const age = 18;

// ===== 老办法：用 + 拼接 =====
const s1 = "我叫" + name + "，今年" + age + "岁。";
console.log(s1);

// ===== 新办法：模板字符串（反引号 + ${}）=====
const s2 = `我叫${name}，今年${age}岁。`;
console.log(s2);

// ${...} 里可以放任意表达式，不只是变量：
console.log(`明年我${age + 1}岁。`);

// 模板字符串天然支持换行：
const poem = `静夜思
床前明月光，
疑是地上霜。`;
console.log(poem);

// ===== 常用转义字符 =====
console.log("换行：第一行\n第二行"); // \n 换行
console.log("制表符：姓名\t年龄"); // \t 制表符（对齐）
console.log("双引号里放双引号：\"引用\""); // \" 转义引号
console.log("反斜杠本身：C:\\Users"); // \\ 表示一个反斜杠

// ===== 几个常用属性/方法（第 3 章详解）=====
const word = "JavaScript";
console.log("长度：", word.length); // 10
console.log("转大写：", word.toUpperCase()); // JAVASCRIPT
console.log("截取：", word.slice(0, 4)); // Java
