// 文件：code/ch14/08-keyof-indexed.ts
// keyof 与索引访问类型 T["key"] 入门

interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

// keyof Product 得到所有键组成的联合："id" | "title" | "price" | "inStock"
type ProductKey = keyof Product;

// 索引访问类型：取出某个属性的类型
type PriceType = Product["price"]; // number
type IdOrTitle = Product["id" | "title"]; // number | string

const key: ProductKey = "title";
const price: PriceType = 99.9;
console.log(key, price);

// 经典用法：类型安全的属性读取函数
function getProp<T, K extends keyof T>(obj: T, k: K): T[K] {
  return obj[k];
}

const laptop: Product = { id: 1, title: "笔记本", price: 6999, inStock: true };

const t = getProp(laptop, "title"); // t 的类型是 string
const p = getProp(laptop, "price"); // p 的类型是 number
console.log(`${t}：￥${p}`);
// getProp(laptop, "color"); // ⚠️ 报错："color" 不是 Product 的键

// 取所有值类型的联合（进阶）：Product[keyof Product]
type ProductValue = Product[keyof Product]; // number | string | boolean
const v: ProductValue = true;
console.log("某个值：", v);

export {};
