// 文件：code/ch12/03-quantifiers.js
// 运行：node code/ch12/03-quantifiers.js
// 本文件演示：量词 * + ? {n} {n,} {n,m}，以及贪婪 vs 非贪婪。

// * 零或多，+ 一或多，? 零或一
console.log("ab* :", "a ab abbb".match(/ab*/g)); // ['a','ab','abbb']
console.log("ab+ :", "a ab abbb".match(/ab+/g)); // ['ab','abbb']（单独的 a 不匹配）
console.log("colou?r:", "color colour".match(/colou?r/g)); // ['color','colour']

// {n} 恰好 n 次，{n,} 至少 n 次，{n,m} n 到 m 次
console.log("\\d{4}:", "年份 2026 和 12".match(/\d{4}/g)); // ['2026']
console.log("\\d{2,3}:", "1 22 333 4444".match(/\d{2,3}/g)); // ['22','333','444','4']?
// 注意上一行：4444 会先匹配 444，剩下的 4 不足 2 位被丢弃 -> ['22','333','444']

// 贪婪（greedy）：默认尽可能多吃
const html = "<b>粗</b><i>斜</i>";
console.log("贪婪 <.+>:", html.match(/<.+>/)[0]); // 整个字符串！从第一个 < 吃到最后一个 >
// 非贪婪（lazy）：量词后加 ?，尽可能少吃
console.log("非贪婪 <.+?>:", html.match(/<.+?>/g)); // ['<b>','</b>','<i>','</i>']
