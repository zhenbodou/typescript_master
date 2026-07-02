// 文件：code/ch01/01-variables.js
// 运行方式：node 01-variables.js

// 用 let 声明一个"可以改变"的变量。
let score = 10; // 声明并赋初值
console.log("初始分数：", score);

score = 25; // 重新赋值，完全合法
console.log("加分后：", score);

// 用 const 声明一个"常量"：一旦赋值，就不能再指向别的值。
const pi = 3.14159;
console.log("圆周率：", pi);

// 下面这行如果取消注释，运行会直接报错：
// TypeError: Assignment to constant variable.
// pi = 3.14;

// 命名要见名知意：好的名字本身就是注释。
let userAge = 18; // 驼峰命名（camelCase），推荐
const MAX_RETRY = 3; // 全大写 + 下划线，常表示"配置型常量"
console.log("用户年龄：", userAge, "，最大重试：", MAX_RETRY);
