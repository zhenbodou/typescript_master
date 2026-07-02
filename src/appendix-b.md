# 附录 B · JS/TS 速查表

速查性质，以表格与精简代码为主。术语给英文原词，随查随用。

---

## 一、JavaScript 语法速查

### 变量声明

| 关键字 | 作用域 | 可重新赋值 | 提升行为 |
| --- | --- | --- | --- |
| `const` | 块级 | ❌ | 有 TDZ |
| `let` | 块级 | ✅ | 有 TDZ |
| `var` | 函数级 | ✅ | 提升为 `undefined`（避免使用） |

### 数据类型

原始类型（primitive）：`string`、`number`、`bigint`、`boolean`、`undefined`、`symbol`、`null`。
引用类型：`object`（含 `Array`、`Function`、`Date`、`RegExp`、`Map`、`Set` 等）。

```javascript
typeof 42;         // 'number'
typeof 42n;        // 'bigint'
typeof 'a';        // 'string'
typeof true;       // 'boolean'
typeof undefined;  // 'undefined'
typeof Symbol();   // 'symbol'
typeof null;       // 'object'（历史 bug）
typeof [];         // 'object' —— 用 Array.isArray 判数组
typeof (() => {}); // 'function'
```

### 运算符

| 运算符 | 含义 | 示例 |
| --- | --- | --- |
| `===` / `!==` | 严格相等（不转型，首选） | `1 === '1'` → false |
| `??` | 空值合并（仅 `null`/`undefined` 才取右值） | `0 ?? 9` → `0` |
| `\|\|` | 逻辑或（假值即取右值） | `0 \|\| 9` → `9` |
| `?.` | 可选链（前值为空则短路返回 undefined） | `a?.b?.c` |
| `??=` | 空值时赋值 | `x ??= 1` |
| `\|\|=` `&&=` | 逻辑赋值 | `x \|\|= 1` |
| `**` | 幂 | `2 ** 10` → 1024 |
| `...` | 展开 / 剩余 | `[...a]` |

```javascript
const name = user.name ?? '匿名';       // null/undefined 才用默认
const city = user?.address?.city;        // 任一环节为空则 undefined
const port = process.env.PORT ?? 3000;
```

> 📌 `??` 与 `||` 的关键区别：`0`、`''`、`false` 对 `??` 是有效值，对 `||` 是假值。

### 模板字符串

```javascript
const s = `Hi ${name}, ${1 + 2} items`;
const multi = `第一行
第二行`;
const tag = String.raw`C:\path\n`; // 不转义
```

### 解构（destructuring）

```javascript
const [a, b, ...rest] = [1, 2, 3, 4];      // a=1 b=2 rest=[3,4]
const { x, y = 10, z: zz } = obj;          // 默认值 + 重命名
const { a: { deep } } = nested;            // 嵌套
function f({ id, name = 'N/A' }) {}         // 参数解构
[a, b] = [b, a];                            // 交换
```

### 展开（spread）

```javascript
const arr = [...a, ...b];              // 合并数组
const obj = { ...base, override: 1 };  // 合并对象（后覆盖前）
fn(...args);                            // 展开为实参
Math.max(...[1, 2, 3]);
```

### 常用字符串方法

| 方法 | 签名 / 说明 |
| --- | --- |
| `length` | 字符数（属性） |
| `slice(start, end?)` | 截取子串，支持负索引 |
| `substring(start, end?)` | 截取（不支持负索引） |
| `at(i)` | 取字符，支持负索引 `s.at(-1)` |
| `includes(sub)` | 是否包含 |
| `startsWith` / `endsWith` | 前缀 / 后缀判断 |
| `indexOf(sub)` | 首次位置，无则 -1 |
| `replace(a, b)` | 替换首个（正则加 `g` 替换全部） |
| `replaceAll(a, b)` | 替换全部 |
| `split(sep)` | 分割为数组 |
| `trim()` / `trimStart` / `trimEnd` | 去空白 |
| `toUpperCase` / `toLowerCase` | 大小写 |
| `padStart(n, c)` / `padEnd` | 补齐到长度 n |
| `repeat(n)` | 重复 n 次 |
| `match` / `matchAll` | 正则匹配 |

### 常用数组方法

| 方法 | 签名 | 一句话 |
| --- | --- | --- |
| `map` | `(fn) => 新数组` | 每项变换，返回等长新数组 |
| `filter` | `(fn) => 新数组` | 保留 fn 返回真值的项 |
| `reduce` | `(fn, init) => 累积值` | 折叠为单个值 |
| `forEach` | `(fn) => undefined` | 遍历副作用，无返回 |
| `find` | `(fn) => 元素\|undefined` | 首个满足条件的元素 |
| `findIndex` | `(fn) => number` | 首个满足条件的索引 |
| `some` | `(fn) => boolean` | 是否**至少一个**满足 |
| `every` | `(fn) => boolean` | 是否**全部**满足 |
| `includes` | `(val) => boolean` | 是否含某值（识别 NaN） |
| `indexOf` | `(val) => number` | 值的位置（用 ===） |
| `sort` | `((a,b)=>number)?` | 原地排序，默认字典序 |
| `reverse` | `() => 数组` | 原地反转 |
| `flat` | `(depth=1)` | 拉平嵌套数组 |
| `flatMap` | `(fn)` | map 后拉平一层 |
| `slice` | `(start?, end?)` | 截取副本（不改原数组） |
| `splice` | `(start, delCount, ...items)` | 原地增删改 |
| `concat` | `(...arrs)` | 拼接返回新数组 |
| `join` | `(sep=',')` | 连接为字符串 |
| `fill` | `(val, start?, end?)` | 原地填充 |
| `at` | `(i)` | 支持负索引取值 |
| `toSorted` / `toReversed` / `with` | — | 返回副本的不可变版本（ES2023） |

```javascript
[1, 2, 3, 4].filter(n => n % 2 === 0);        // [2, 4]
[1, 2, 3].map(n => n * 2);                     // [2, 4, 6]
[1, 2, 3].reduce((sum, n) => sum + n, 0);      // 6
[[1], [2, [3]]].flat(Infinity);               // [1, 2, 3]
```

### 对象与 `Object.*`

| 方法 | 说明 |
| --- | --- |
| `Object.keys(o)` | 自身可枚举键数组 |
| `Object.values(o)` | 值数组 |
| `Object.entries(o)` | `[key, value]` 对数组 |
| `Object.fromEntries(pairs)` | entries 反向构造对象 |
| `Object.assign(t, ...s)` | 浅合并到 t |
| `Object.freeze(o)` | 冻结（浅，不可增删改） |
| `Object.create(proto)` | 以指定原型创建对象 |
| `Object.getPrototypeOf(o)` | 取原型 |
| `structuredClone(o)` | 深拷贝 |
| `'k' in o` | 键是否存在（含原型链） |
| `o.hasOwnProperty('k')` | 自身键判断 |

```javascript
for (const [k, v] of Object.entries({ a: 1, b: 2 })) {}
const clone = structuredClone(deepObj);
```

### Map / Set

```javascript
const m = new Map([['a', 1]]);
m.set('b', 2); m.get('a'); m.has('a'); m.delete('a'); m.size;
for (const [k, v] of m) {}

const s = new Set([1, 2, 2, 3]); // {1, 2, 3}
s.add(4); s.has(2); s.delete(1); s.size;
const unique = [...new Set(arr)]; // 数组去重
```

> 💡 `Map` 的键可以是任意类型且保持插入顺序；对象键只能是字符串/Symbol。

### Promise / async

```javascript
Promise.all([p1, p2]);         // 全部成功→结果数组；任一失败→reject
Promise.allSettled([p1, p2]);  // 全部结算，每项 {status, value|reason}
Promise.race([p1, p2]);        // 最先结算（成功或失败）者
Promise.any([p1, p2]);         // 最先成功者；全失败→AggregateError
Promise.resolve(v);            // 立即成功
Promise.reject(e);             // 立即失败

async function f() {
  try {
    const r = await fetchData();
    return r;
  } catch (e) { /* 处理错误 */ }
}
```

---

## 二、正则速查（RegExp）

### 元字符

| 符号 | 含义 |
| --- | --- |
| `.` | 除换行外任意字符 |
| `\d` `\D` | 数字 / 非数字 |
| `\w` `\W` | 单词字符 `[A-Za-z0-9_]` / 非单词 |
| `\s` `\S` | 空白 / 非空白 |
| `\b` `\B` | 单词边界 / 非边界 |
| `[abc]` | 字符集合任一 |
| `[^abc]` | 排除集合 |
| `[a-z]` | 范围 |
| `\` | 转义 |

### 量词（quantifier）

| 符号 | 含义 |
| --- | --- |
| `*` | 0 次或多次 |
| `+` | 1 次或多次 |
| `?` | 0 次或 1 次 |
| `{n}` | 恰好 n 次 |
| `{n,}` | 至少 n 次 |
| `{n,m}` | n 到 m 次 |
| `*?` `+?` `??` | 惰性（非贪婪）匹配 |

### 锚点与分组

| 符号 | 含义 |
| --- | --- |
| `^` | 行/串开头 |
| `$` | 行/串结尾 |
| `(...)` | 捕获分组 |
| `(?:...)` | 非捕获分组 |
| `(?<name>...)` | 命名捕获组 |
| `\1` / `\k<name>` | 反向引用 |
| `(?=...)` | 正向先行断言 |
| `(?!...)` | 负向先行断言 |
| `(?<=...)` | 正向后行断言 |
| `(?<!...)` | 负向后行断言 |
| `a\|b` | 或 |

### 常用 flag

| flag | 含义 |
| --- | --- |
| `g` | 全局匹配 |
| `i` | 忽略大小写 |
| `m` | 多行（`^`/`$` 匹配每行） |
| `s` | `.` 匹配换行（dotAll） |
| `u` | Unicode 模式 |
| `y` | 粘连（从 lastIndex 开始） |

### 常用方法

```javascript
/\d+/.test('a1');                 // true —— 是否匹配
'a1b2'.match(/\d/g);              // ['1', '2'] —— 全部匹配（需 g）
[...'a1b2'.matchAll(/(\w)(\d)/g)]; // 带分组的全部匹配（迭代）
'2024-01'.replace(/(\d+)-(\d+)/, '$2/$1'); // '01/2024' —— $n 引用分组
'a,b;c'.split(/[,;]/);            // ['a', 'b', 'c']
const m = /(?<y>\d{4})/.exec('2024'); m.groups.y; // '2024' 命名组
```

---

## 三、TypeScript 类型速查

### 基础类型

```typescript
let s: string; let n: number; let b: boolean;
let big: bigint; let sym: symbol;
let u: undefined; let nl: null;
let anyV: any; let unknownV: unknown; let never: never;
let voidFn: () => void;
let lit: 'on' | 'off';          // 字面量联合
let tup: readonly [number, string]; // 只读元组
```

### 数组与元组

```typescript
let a: number[];             // 或 Array<number>
let t: [string, number];     // 元组（定长定序）
let named: [x: number, y: number];   // 具名元组
let rest: [first: string, ...nums: number[]]; // 可变元组
```

### 联合与交叉

```typescript
type Union = string | number;         // 联合：其一
type Cross = A & B;                    // 交叉：兼具（合并成员）
type Result = { ok: true; data: T } | { ok: false; error: string }; // 可辨识联合
```

### interface vs type

| | `interface` | `type` |
| --- | --- | --- |
| 声明合并 | ✅ 支持 | ❌ |
| 扩展 | `extends` | `&` 交叉 |
| 联合/元组/映射 | ❌ | ✅ |
| 基本类型别名 | ❌ | ✅ `type ID = string` |
| 性能（大型对象） | 略优 | — |

> 💡 经验：对象/类的公共 API 用 `interface`，联合/工具/复杂类型用 `type`。

### 泛型（generics）

```typescript
function identity<T>(x: T): T { return x; }
interface Box<T> { value: T; }
type Pair<K, V> = { key: K; value: V };
function first<T>(arr: T[]): T | undefined { return arr[0]; }
function pick<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; } // 约束
class Store<T = string> { items: T[] = []; } // 默认类型参数
```

### keyof / typeof / 索引访问

```typescript
type Keys = keyof { a: 1; b: 2 };   // 'a' | 'b'
const cfg = { port: 3000 };
type Cfg = typeof cfg;               // { port: number }
type Port = Cfg['port'];             // number（索引访问）
type Values = Cfg[keyof Cfg];        // number
```

### 条件类型与 infer

```typescript
type IsString<T> = T extends string ? true : false;
type ElementType<T> = T extends (infer U)[] ? U : T; // 提取数组元素类型
type Unwrap<T> = T extends Promise<infer V> ? V : T;
type Flatten<T> = T extends Array<infer Item> ? Item : T;
```

### 映射类型（mapped type）

```typescript
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Renamed<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }; // key remapping
```

### 模板字面量类型

```typescript
type Event = `on${'Click' | 'Hover'}`;    // 'onClick' | 'onHover'
type Route = `/api/${string}`;
type CSSUnit = `${number}px` | `${number}%`;
```

### 内置工具类型

| 工具类型 | 一句话 |
| --- | --- |
| `Partial<T>` | 所有属性变可选 |
| `Required<T>` | 所有属性变必填 |
| `Readonly<T>` | 所有属性变只读 |
| `Pick<T, K>` | 从 T 挑选 K 键组成新类型 |
| `Omit<T, K>` | 从 T 剔除 K 键 |
| `Record<K, V>` | 键为 K、值为 V 的对象类型 |
| `Exclude<U, E>` | 从联合 U 中排除可赋给 E 的成员 |
| `Extract<U, E>` | 从联合 U 中提取可赋给 E 的成员 |
| `NonNullable<T>` | 从 T 去除 `null` 和 `undefined` |
| `ReturnType<F>` | 提取函数返回值类型 |
| `Parameters<F>` | 提取函数参数为元组类型 |
| `Awaited<T>` | 递归解包 Promise 的结果类型 |
| `InstanceType<C>` | 构造函数的实例类型 |
| `ConstructorParameters<C>` | 构造函数参数元组 |

```typescript
type UserPreview = Pick<User, 'id' | 'name'>;
type Dict = Record<string, number>;
type R = ReturnType<typeof fetchUser>; // Promise<User>
type U = Awaited<R>;                    // User
type NoNull = NonNullable<string | null | undefined>; // string
```

### 类型守卫与断言

```typescript
// typeof / instanceof / in 内置守卫
if (typeof x === 'string') { /* x: string */ }
if (x instanceof Date) {}
if ('id' in obj) {}

// 自定义类型谓词（type predicate）
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}

// 断言函数
function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const v = x as User;         // 类型断言（编译期，不校验，慎用）
const s = x!;                // 非空断言（慎用）
const c = 'on' as const;     // const 断言 → 字面量类型
```

### 常用 tsconfig 选项

| 选项 | 说明 |
| --- | --- |
| `target` | 编译输出的 ES 版本（如 `ES2022`） |
| `module` | 模块系统（`ESNext` / `NodeNext` / `CommonJS`） |
| `moduleResolution` | 模块解析策略（`bundler` / `NodeNext`） |
| `strict` | 开启全部严格检查（**强烈建议 true**） |
| `noImplicitAny` | 禁止隐式 any（含于 strict） |
| `strictNullChecks` | 区分 null/undefined（含于 strict） |
| `esModuleInterop` | 兼容 CJS 默认导入 |
| `outDir` / `rootDir` | 输出目录 / 源根目录 |
| `declaration` | 生成 `.d.ts` 声明文件 |
| `sourceMap` | 生成 source map |
| `skipLibCheck` | 跳过 `.d.ts` 检查（提速） |
| `noUnusedLocals` / `noUnusedParameters` | 报告未用变量/参数 |
| `noUncheckedIndexedAccess` | 索引访问结果带 undefined（更安全） |
| `lib` | 引入的内置类型库（如 `["ES2022", "DOM"]`） |
| `paths` / `baseUrl` | 路径别名 |
| `allowJs` / `checkJs` | 允许 / 检查 JS 文件 |

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  }
}
```

---

## 四、常用 CLI 命令速查

### node / npm / npx

```bash
node app.js                 # 运行脚本
node --watch app.js         # 文件变化自动重启
npm init -y                 # 初始化 package.json
npm install <pkg>           # 安装依赖（-D 开发依赖，-g 全局）
npm ci                      # 按 lockfile 干净安装（CI 用）
npm run <script>            # 运行 package.json scripts
npm update / npm outdated   # 更新 / 查看过期依赖
npx <pkg>                   # 不安装直接执行包
```

### tsc / tsx

```bash
tsc                         # 按 tsconfig 编译
tsc --noEmit                # 只类型检查不产出（CI 门禁常用）
tsc --watch                 # 监听编译
tsc --init                  # 生成 tsconfig.json
tsx script.ts               # 直接运行 TS（无需先编译）
tsx watch script.ts         # 监听运行
```

### vitest / eslint / prettier

```bash
vitest                      # 监听模式跑测试
vitest run                  # 单次运行（CI）
vitest run --coverage       # 覆盖率报告
vitest --ui                 # 图形界面

eslint .                    # 检查
eslint . --fix              # 自动修复
eslint . --max-warnings=0   # 有警告即失败

prettier --write .          # 格式化并写回
prettier --check .          # 只检查是否已格式化（CI）
```
