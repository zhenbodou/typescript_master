# 附录 A · 常见陷阱与最佳实践

本附录汇总全书最容易踩的坑与推荐做法。每条按 **⚠️ 陷阱现象 → 为什么 → ✅ 正确做法** 组织，配简短示例，便于随手查阅。

---

## 一、相等与类型转换

### ⚠️ 用 `==` 导致意外的隐式转换

**为什么**：`==`（宽松相等）会在比较前对两侧做类型转换，规则复杂且反直觉。

```javascript
0 == '';        // true
0 == '0';       // true
'' == '0';      // false  ——— 不满足传递性！
null == undefined; // true
[] == false;    // true
[] == ![];      // true
```

✅ **正确做法**：始终用 `===` / `!==`（严格相等，不转换类型）。只有一个例外可用 `== null` 同时判断 `null` 和 `undefined`。

```javascript
if (x === 3) { /* ... */ }
if (value == null) { /* 等价于 value === null || value === undefined */ }
```

### ⚠️ `NaN` 和任何值都不相等，包括它自己

```javascript
NaN === NaN;        // false
[NaN].includes(NaN); // true（includes 用 SameValueZero，可识别 NaN）
[NaN].indexOf(NaN);  // -1（indexOf 用 ===，找不到）
```

✅ 用 `Number.isNaN(x)` 判断；`Array.prototype.includes` 能识别 NaN，`indexOf` 不能。

> 📌 `Number.isNaN` 与全局 `isNaN` 不同：后者会先转型，`isNaN('abc')` 为 `true`，几乎总该用前者。

### ⚠️ 浮点数运算不精确：`0.1 + 0.2 !== 0.3`

**为什么**：IEEE 754 双精度浮点无法精确表示 0.1、0.2。

```javascript
0.1 + 0.2;           // 0.30000000000000004
0.1 + 0.2 === 0.3;   // false
```

✅ 比较用误差容忍；金额等场景用整数（以「分」为单位）或十进制库（decimal.js）。

```javascript
Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON; // true
```

### ⚠️ `typeof null === 'object'`

这是 JS 历史遗留 bug，永远不会修复。

```javascript
typeof null;        // 'object'
typeof undefined;   // 'undefined'
typeof function(){}; // 'function'
typeof [];          // 'object'（数组也是 object）
```

✅ 判 null 用 `x === null`；判数组用 `Array.isArray(x)`；判对象用 `x !== null && typeof x === 'object'`。

### ⚠️ 隐式转换制造"惊喜"

```javascript
[] + [];       // ''（空字符串）
[] + {};       // '[object Object]'
'5' - 1;       // 4（减法转数字）
'5' + 1;       // '51'（加法遇字符串转拼接）
true + 1;      // 2
```

✅ 显式转换：`Number(x)`、`String(x)`、`Boolean(x)`。数字解析用 `Number('42')` 或 `parseInt('42', 10)`（**始终带基数 10**）。

---

## 二、变量与作用域

### ⚠️ `var` 的函数作用域与变量提升

**为什么**：`var` 无块级作用域、会提升到函数顶部（值为 `undefined`）。

```javascript
if (true) { var x = 1; }
console.log(x); // 1 —— 泄漏到块外

console.log(y); // undefined（提升，不报错）
var y = 2;
```

✅ 一律用 `const`，需要重新赋值时才用 `let`，**永远不用 `var`**。

### ⚠️ TDZ（暂时性死区，Temporal Dead Zone）

`let` / `const` 也会提升，但在声明前访问会抛错。

```javascript
console.log(a); // ❌ ReferenceError: Cannot access 'a' before initialization
let a = 1;
```

✅ 变量先声明后使用；把声明放在使用之前，符合直觉。

### ⚠️ 循环里用 `var` 创建闭包，全部拿到同一个值

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 打印 3, 3, 3
}
```

**为什么**：`var i` 是唯一一个被所有回调共享的变量，循环结束时它是 3。

✅ 用 `let`——每次迭代绑定一个新的块级 `i`。

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 0, 1, 2
}
```

---

## 三、this 与箭头函数

### ⚠️ 方法作为回调传递后丢失 `this`

```javascript
class Counter {
  count = 0;
  inc() { this.count++; }
}
const c = new Counter();
setTimeout(c.inc, 100); // ❌ this 为 undefined（严格模式），报错
```

**为什么**：`this` 由**调用方式**决定，脱离对象调用后 `this` 不再指向实例。

✅ 用箭头函数保留词法 `this`，或 `bind`，或类字段写成箭头方法。

```javascript
setTimeout(() => c.inc(), 100);           // ✅ 词法 this
setTimeout(c.inc.bind(c), 100);           // ✅ 显式绑定
class Counter { inc = () => { this.count++; }; } // ✅ 类字段箭头
```

### ⚠️ 把对象方法写成箭头函数

```javascript
const obj = {
  name: 'A',
  greet: () => console.log(this.name), // ❌ this 指向外层（模块/window），非 obj
};
```

✅ 对象方法用简写方法或普通函数，需要 `this` 指向对象时**不要用箭头函数**。

```javascript
const obj = { name: 'A', greet() { console.log(this.name); } };
```

> 💡 记忆口诀：**需要动态 this（对象方法、原型方法）→ 普通函数；需要固定外层 this（回调）→ 箭头函数。**

---

## 四、数组与对象

### ⚠️ 对象/数组是引用，赋值只是复制引用

```javascript
const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n); // 2 —— a、b 指向同一对象
```

✅ 需要副本时显式拷贝；理解「相等比较的是引用」。

```javascript
a === b;             // 只有同一引用才 true
({a:1}) === ({a:1}); // false
```

### ⚠️ 展开 / `Object.assign` 只是浅拷贝

```javascript
const orig = { user: { name: 'A' } };
const copy = { ...orig };
copy.user.name = 'B';
console.log(orig.user.name); // 'B' —— 嵌套对象仍共享
```

✅ 深拷贝用 `structuredClone(orig)`（现代运行时内置），或按需手动深拷贝。

```javascript
const deep = structuredClone(orig); // ✅ 独立副本
```

### ⚠️ `sort` 默认按字符串字典序排序

```javascript
[1, 2, 10, 21].sort();          // [1, 10, 2, 21] ❌
[1, 2, 10, 21].sort((a, b) => a - b); // [1, 2, 10, 21] ✅
```

**为什么**：不传比较函数时，元素被转成字符串比较。另外，`sort` **原地修改**原数组。

✅ 数字排序永远传 `(a, b) => a - b`；不想改原数组先 `[...arr].sort(...)` 或 `arr.toSorted(...)`。

### ⚠️ 稀疏数组（有"空洞"）行为不一致

```javascript
const arr = [1, , 3];   // 中间是空洞
arr.length;              // 3
arr.forEach(x => console.log(x)); // 只打印 1、3（跳过空洞）
arr.map(x => x * 2);     // [2, <empty>, 6] —— 空洞被保留
```

✅ 避免制造空洞；用 `Array.from({length: n}, (_, i) => i)` 或 `Array(3).fill(0)` 初始化密集数组。

### ⚠️ 在 `forEach` 里用 `async`，回调不会被等待

```javascript
[1, 2, 3].forEach(async (id) => {
  await save(id); // ❌ forEach 忽略返回的 Promise，不会等待
});
console.log('done'); // 在 save 完成前就打印了
```

✅ 顺序执行用 `for...of`；并行执行用 `map` + `Promise.all`。

```javascript
for (const id of ids) { await save(id); }         // 串行
await Promise.all(ids.map(id => save(id)));        // 并行
```

### ⚠️ 遍历时删除/修改数组导致漏项

✅ 需要删除时从后往前遍历，或用 `filter` 生成新数组。

---

## 五、异步编程

### ⚠️ 忘记 `await`，拿到的是 Promise 而非结果

```javascript
async function f() {
  const data = fetchData(); // ❌ 忘了 await，data 是 Promise
  return data.value;        // undefined
}
```

✅ 调用返回 Promise 的函数时记得 `await`；开启 ESLint 规则 `no-floating-promises`（typescript-eslint）辅助排查。

### ⚠️ 未捕获的 Promise rejection

```javascript
async function risky() { throw new Error('boom'); }
risky(); // ❌ 无 catch，触发 unhandledRejection
```

✅ 用 `try/catch` 包裹 `await`，或 `.catch()`；顶层可监听 `process.on('unhandledRejection', ...)` 兜底。

### ⚠️ 本可并行却写成串行，浪费时间

```javascript
const a = await taskA(); // 等 A 完成
const b = await taskB(); // 再等 B —— 两者其实无依赖
```

✅ 无依赖的任务同时发起，再一起 await。

```javascript
const [a, b] = await Promise.all([taskA(), taskB()]); // ✅ 并行
```

> 💡 `Promise.all` 任一失败即整体 reject；要"全部完成不管成败"用 `Promise.allSettled`。

### ⚠️ 在 `new Promise` 构造器的异步回调里 `throw`

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => { throw new Error('x'); }, 0); // ❌ 无人捕获，变成 unhandled
});
```

**为什么**：构造器**同步部分**的 throw 会被转成 reject，但异步回调里的 throw 逃出了 Promise 的捕获范围。

✅ 优先用 `async` 函数而非手写 `new Promise`；必须手写时用 `reject(err)` 而非 `throw`。

---

## 六、模块

### ⚠️ ESM 与 CommonJS 混用

**为什么**：`import`/`export`（ESM）与 `require`/`module.exports`（CJS）是两套系统，规则不同（ESM 静态、异步加载、导入声明会提升）。

```javascript
// package.json 里 "type": "module" 决定 .js 按 ESM 解析
// CJS 中不能直接 require 一个 ESM-only 包；需 dynamic import()
const mod = await import('esm-only-pkg'); // ✅ 在 CJS 里加载 ESM
```

✅ 新项目统一用 ESM（`"type": "module"`）；`__dirname` 在 ESM 中不存在，用 `import.meta.url` 派生。

```javascript
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### ⚠️ 循环依赖导致拿到 `undefined`

**为什么**：A 引 B、B 引 A，先加载的模块在对方尚未初始化完成时读到未定义的导出。

✅ 拆分公共依赖到第三个模块；把导入下移到函数内部延迟求值；重构消除环。

---

## 七、TypeScript

### ⚠️ 滥用 `any`，等于关掉类型检查

```typescript
function parse(input: any) { return input.foo.bar; } // 全程无提示、无检查
```

✅ 用 `unknown` 表示"类型未知"，强制在使用前收窄；开启 `noImplicitAny`。

```typescript
function parse(input: unknown) {
  if (typeof input === 'object' && input !== null && 'foo' in input) { /* 收窄后使用 */ }
}
```

### ⚠️ 用 `as` 断言掩盖真实类型不匹配

```typescript
const el = document.getElementById('x') as HTMLInputElement; // 若其实不是 input，运行时崩
const data = JSON.parse(str) as User;  // ❌ 断言≠校验，运行时可能不符
```

**为什么**：`as` 只在编译期"说服"编译器，不做任何运行时检查。

✅ 能收窄就用类型守卫；外部数据用运行时校验（zod / valibot）再得到类型。

```typescript
import { z } from 'zod';
const User = z.object({ id: z.number(), name: z.string() });
const user = User.parse(JSON.parse(str)); // ✅ 运行时校验 + 类型推断
```

### ⚠️ 非空断言 `!` 的风险

```typescript
const user = users.find(u => u.id === id)!; // 若找不到，运行时是 undefined，后续崩
user.name; // 💥
```

✅ 显式处理 `undefined` 分支，别用 `!` 消警告。

```typescript
const user = users.find(u => u.id === id);
if (!user) throw new Error('not found');
user.name; // ✅ 安全
```

### ⚠️ `enum` 的坑

**为什么**：数字 `enum` 会反向映射、允许赋任意数字；`enum` 会生成运行时代码、不利于 tree-shaking；`const enum` 在 `isolatedModules` / 某些打包器下有兼容问题。

```typescript
enum Dir { Up, Down }
const d: Dir = 99; // ❌ 编译不报错（数字 enum 太松）
```

✅ 优先用**联合字符串字面量**或 `as const` 对象，更轻更安全。

```typescript
type Dir = 'up' | 'down';                        // ✅ 首选
const Dir = { Up: 'up', Down: 'down' } as const;  // ✅ 需要值时
type DirValue = typeof Dir[keyof typeof Dir];     // 'up' | 'down'
```

### ⚠️ 该用 `unknown` 时却用 `any`

`any` 会向外"传染"关闭检查；`unknown` 是类型安全的顶层类型，使用前必须收窄。捕获错误时尤其如此：

```typescript
try { /* ... */ } catch (e) { // e 默认 unknown
  if (e instanceof Error) console.log(e.message); // ✅ 先收窄
}
```

### ⚠️ 结构类型带来的"意外兼容"

**为什么**：TS 是结构化类型（structural typing / duck typing），形状匹配即兼容，哪怕语义不同。

```typescript
interface Meter { value: number; }
interface Second { value: number; }
const m: Meter = { value: 5 };
const s: Second = m; // ✅ 编译通过 —— 但语义上是错的
```

✅ 需要名义类型时用**品牌类型（branded type）**区分。

```typescript
type Meter = number & { readonly __brand: 'meter' };
```

### ⚠️ 类型在运行时不存在（外部数据要校验）

```typescript
interface User { id: number; }
if (obj instanceof User) {} // ❌ 报错：interface 编译后消失，无法用于 instanceof
```

**为什么**：`interface` / `type` 是纯编译期构造，编译后被完全擦除。类型标注**不保证**运行时数据真的符合。

✅ 运行时判断用 `typeof` / `in` / `instanceof`（针对 class）/ 校验库；边界（API 响应、localStorage、JSON、用户输入）一律校验，别信类型标注。

---

## 八、工程实践

### ⚠️ 不写测试

**为什么**：重构时无法确认是否破坏原有行为，回归靠人肉。

✅ 至少为核心逻辑、纯函数、边界条件写单元测试（Vitest）；修 bug 时先写一个复现测试。

### ⚠️ 忽略 lint 警告

✅ CI 中把 lint / typecheck 作为**门禁**（失败即阻断合并）；`eslint --max-warnings=0`；不要随意 `// eslint-disable` 而不写原因。

### ⚠️ 把密钥/令牌提交进 git

**为什么**：git 历史永久保留，即使后续删除，仓库历史里仍可检出；公开仓库会被爬虫秒扫。

✅ 密钥放环境变量 / `.env`，并把 `.env` 加入 `.gitignore`；提交模板 `.env.example`（不含真实值）；已泄露的密钥**立即吊销轮换**，而不只是删文件。

```bash
# .gitignore
.env
*.local
```

> 📌 用 `gitleaks`、`git-secrets` 等工具在提交前扫描；GitHub 的 Push Protection 也能拦截。

---

## 速记清单

| 场景 | 一句话 |
| --- | --- |
| 相等比较 | 永远 `===`，只用 `== null` 判空 |
| 判 NaN | `Number.isNaN` |
| 判数组 | `Array.isArray` |
| 声明变量 | `const` 优先，`let` 次之，禁 `var` |
| 对象方法 this | 用普通函数，回调用箭头函数 |
| 深拷贝 | `structuredClone` |
| 数字排序 | `sort((a,b) => a-b)` |
| 循环里异步 | 串行 `for...of`，并行 `Promise.all(map)` |
| 未知类型 | `unknown` 而非 `any` |
| 外部数据 | 运行时校验（zod），别信 `as` |
| 找不到的值 | 显式处理，别用 `!` |
| 密钥 | 环境变量 + `.gitignore` |
