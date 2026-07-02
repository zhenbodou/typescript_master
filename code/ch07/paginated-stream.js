// 文件：code/ch07/paginated-stream.js
// 本章小项目：分页数据流
// 用生成器惰性地一页一页 yield 出数据项；用 Map 分组统计，用 Set 去重。

// ——————————————————————————————————————————
// 0) 模拟数据源：一批“商品”记录
// ——————————————————————————————————————————
const PRODUCTS = [
  { id: 1, name: "苹果", category: "水果", tags: ["生鲜", "热销"] },
  { id: 2, name: "香蕉", category: "水果", tags: ["生鲜"] },
  { id: 3, name: "牛奶", category: "乳品", tags: ["生鲜", "热销"] },
  { id: 4, name: "酸奶", category: "乳品", tags: ["生鲜"] },
  { id: 5, name: "面包", category: "烘焙", tags: ["热销"] },
  { id: 6, name: "蛋糕", category: "烘焙", tags: [] },
  { id: 7, name: "橙子", category: "水果", tags: ["生鲜"] },
  { id: 8, name: "奶酪", category: "乳品", tags: ["进口"] },
  { id: 9, name: "饼干", category: "烘焙", tags: ["热销", "进口"] },
  { id: 10, name: "西瓜", category: "水果", tags: ["生鲜", "热销"] },
];

// ——————————————————————————————————————————
// 1) 模拟“按页拉取”的函数：给定页码和每页大小，返回这一页的数据。
//    真实项目里这一步通常是一次网络请求（返回 Promise）。这里用同步数组模拟。
//    返回 { items, hasNext }：这一页的数据，以及是否还有下一页。
// ——————————————————————————————————————————
function fetchPage(pageIndex, pageSize) {
  const start = pageIndex * pageSize;
  const items = PRODUCTS.slice(start, start + pageSize);
  const hasNext = start + pageSize < PRODUCTS.length;
  return { items, hasNext };
}

// ——————————————————————————————————————————
// 2) 核心：用生成器把“一页页拉取”变成“一项项 yield”。
//    调用方完全感觉不到分页的存在，像遍历一个普通序列一样用 for...of。
//    惰性：只有当调用方要下一项、且当前页已耗尽时，才去拉取下一页。
// ——————————————————————————————————————————
function* paginatedStream(pageSize = 3) {
  let pageIndex = 0;
  let hasNext = true;
  while (hasNext) {
    const page = fetchPage(pageIndex, pageSize);
    // 打印一行，方便你直观看到“什么时候才真正拉取了一页”
    console.log(`  [拉取第 ${pageIndex + 1} 页，共 ${page.items.length} 项]`);
    for (const item of page.items) {
      yield item; // 逐项交出去，把控制权还给调用方
    }
    hasNext = page.hasNext;
    pageIndex++;
  }
}

// ——————————————————————————————————————————
// 3) 通用惰性工具：只取前 N 项。因为生成器是惰性的，
//    只取前 2 项时，只会触发第 1 页的拉取，后面的页根本不会被请求。
// ——————————————————————————————————————————
function* take(iterable, count) {
  let i = 0;
  for (const item of iterable) {
    if (i >= count) return;
    yield item;
    i++;
  }
}

// ——————————————————————————————————————————
// 4) 用 Map 做“按分类分组统计”
// ——————————————————————————————————————————
function groupByCategory(iterable) {
  const groups = new Map(); // 键：分类名；值：该分类的商品名数组
  for (const product of iterable) {
    if (!groups.has(product.category)) {
      groups.set(product.category, []);
    }
    groups.get(product.category).push(product.name);
  }
  return groups;
}

// ——————————————————————————————————————————
// 5) 用 Set 收集“所有出现过的标签”（自动去重）
// ——————————————————————————————————————————
function collectTags(iterable) {
  const tags = new Set();
  for (const product of iterable) {
    for (const tag of product.tags) {
      tags.add(tag); // 重复的标签自动被忽略
    }
  }
  return tags;
}

// ——————————————————————————————————————————
// 演示（作为主模块运行时才执行）
// ——————————————————————————————————————————
function main() {
  console.log("=== A. 遍历全部（会触发全部分页拉取） ===");
  for (const product of paginatedStream(3)) {
    console.log("  ->", product.id, product.name);
  }

  console.log("\n=== B. 只取前 2 项（惰性：只拉取第 1 页！） ===");
  for (const product of take(paginatedStream(3), 2)) {
    console.log("  ->", product.id, product.name);
  }

  console.log("\n=== C. 用 Map 按分类分组统计 ===");
  const groups = groupByCategory(paginatedStream(3));
  for (const [category, names] of groups) {
    console.log(`  ${category}（${names.length}）: ${names.join("、")}`);
  }

  console.log("\n=== D. 用 Set 收集所有标签（去重） ===");
  const tags = collectTags(paginatedStream(3));
  console.log("  所有标签:", [...tags].join("、"));
  console.log("  标签总数:", tags.size);
}

// 只有直接 `node paginated-stream.js` 才运行 main；被 import 时不运行。
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { paginatedStream, take, groupByCategory, collectTags, fetchPage, PRODUCTS };
