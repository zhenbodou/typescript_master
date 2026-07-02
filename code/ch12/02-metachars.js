// 文件：code/ch12/02-metachars.js
// 运行：node code/ch12/02-metachars.js
// 本文件演示：元字符 . \d \w \s 及其大写取反、字符组 [...] [^...] 与范围。

const s = "价格 A1_ b2? 空 格";

// \d 数字，\D 非数字
console.log("\\d 找数字:", s.match(/\d/g)); // ['1','2']
// \w 单词字符（字母、数字、下划线），\W 取反
console.log("\\w 单词字符:", "a_1 中!".match(/\w/g)); // ['a','_','1']  中文和 ! 不算
// \s 空白（空格、制表符、换行），\S 非空白
console.log("\\s 空白数量:", ("a b\tc\nd".match(/\s/g) || []).length); // 3

// . 匹配"除换行外任意一个字符"
console.log(".  任意字符:", "cat cut cot".match(/c.t/g)); // ['cat','cut','cot']

// [...] 字符组：括号内任选一个
console.log("[aeiou] 元音:", "regex".match(/[aeiou]/g)); // ['e','e']
// 范围：a-z、0-9
console.log("[a-f0-3]:", "a3g9c".match(/[a-f0-3]/g)); // ['a','3','c']
// [^...] 取反：不是这些字符
console.log("[^0-9] 非数字:", "a1b2".match(/[^0-9]/g)); // ['a','b']

// ⚠️ 在字符组里，大多数元字符会"失去魔力"变成普通字符。
// 下面这个组匹配的是真正的点、加号、星号本身。
console.log("组内的 . + *:", "1.2+3*4".match(/[.+*]/g)); // ['.','+','*']
