// 文件：code/ch03/02-array-basics.js
// 运行方式：node 02-array-basics.js
// 主题：数组的创建、索引、增删、slice、concat、扩展运算符

// 1) 创建与索引
const nums = [10, 20, 30];
console.log("第 0 个：", nums[0]); // 10
console.log("长度：", nums.length); // 3
console.log("越界访问：", nums[99]); // undefined（不报错）

// 2) 修改与新增（数组是可变的，和字符串不同）
nums[0] = 100;
nums[3] = 40; // 直接给新索引赋值也能扩展
console.log("修改后：", nums); // [100, 20, 30, 40]

// 3) 末尾增删：push / pop（会改变原数组，并返回值）
const stack = [1, 2];
const newLen = stack.push(3); // 末尾加 3，返回新长度 3
console.log("push 后：", stack, "新长度：", newLen); // [1,2,3] 3
const popped = stack.pop(); // 弹出末尾元素 3
console.log("pop 后：", stack, "弹出：", popped); // [1,2] 3

// 4) 开头增删：unshift / shift
const queue = [1, 2];
queue.unshift(0); // 开头加 0
console.log("unshift 后：", queue); // [0,1,2]
const first = queue.shift(); // 移除开头
console.log("shift 后：", queue, "移除：", first); // [1,2] 0

// 5) splice(start, deleteCount, ...items)：万能增删改（改原数组）
const letters = ["a", "b", "c", "d"];
const removed = letters.splice(1, 2, "X", "Y", "Z"); // 从索引1删2个，插入3个
console.log("splice 后：", letters); // ["a","X","Y","Z","d"]
console.log("被删除的：", removed); // ["b","c"]

// 6) slice(start, end)：截取一段，返回新数组，不改原数组
const arr = [0, 1, 2, 3, 4];
console.log("slice(1, 3)：", arr.slice(1, 3)); // [1,2]
console.log("slice(-2)：", arr.slice(-2)); // [3,4]
console.log("原数组没变：", arr); // [0,1,2,3,4]

// 7) concat：拼接，返回新数组
const a = [1, 2];
const b = [3, 4];
console.log("concat：", a.concat(b, [5])); // [1,2,3,4,5]
console.log("a 没变：", a); // [1,2]

// 8) 扩展运算符 ...：把数组"摊开"
console.log("展开合并：", [...a, ...b, 5]); // [1,2,3,4,5]
const copy = [...a]; // 快速浅拷贝一个数组
copy.push(99);
console.log("拷贝改动不影响原数组：", a, copy); // [1,2] [1,2,99]

// 9) 常用判断与查找
console.log("是数组吗：", Array.isArray(arr)); // true
console.log("indexOf(3)：", arr.indexOf(3)); // 3
console.log("includes(3)：", arr.includes(3)); // true
