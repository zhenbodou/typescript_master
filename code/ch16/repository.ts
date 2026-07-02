// 文件：code/ch16/repository.ts
// 本章小项目：类型安全的仓储（Repository）。
// 一个泛型内存仓储，所有方法的类型都随实体 T 精确变化。
// 运行：npx tsx ch16/repository.ts

// 所有能被仓储管理的实体，都必须有一个 number 类型的 id。
// 用泛型约束 T extends { id: number } 表达这条规则。
interface Entity {
  id: number;
}

// 分页参数：page 从 1 开始，pageSize 是每页条数。
interface PageOptions {
  page: number;
  pageSize: number;
}

// 分页结果：随 T 变化的泛型返回类型。
interface Page<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

class Repository<T extends Entity> {
  // 用 Map<number, T> 存储，key 是实体 id。
  private store = new Map<number, T>();

  // 新增。返回被存入的实体本身（类型是 T）。
  add(entity: T): T {
    if (this.store.has(entity.id)) {
      throw new Error(`id=${entity.id} 已存在`);
    }
    this.store.set(entity.id, entity);
    return entity;
  }

  // 按 id 查询。找不到时返回 undefined，所以返回类型是 T | undefined。
  getById(id: number): T | undefined {
    return this.store.get(id);
  }

  // 局部更新：patch 是 T 的「部分字段」，用 Partial<T> 表达。
  // 注意用 Omit 去掉 id，避免调用方偷偷改主键。
  update(id: number, patch: Partial<Omit<T, "id">>): T | undefined {
    const existing = this.store.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch } as T;
    this.store.set(id, updated);
    return updated;
  }

  // 删除。返回是否删掉了东西。
  remove(id: number): boolean {
    return this.store.delete(id);
  }

  // 返回全部实体（拷贝成数组），类型是 T[]。
  findAll(): T[] {
    return [...this.store.values()];
  }

  // 用任意谓词函数筛选。predicate 接收 T、返回 boolean。
  findBy(predicate: (entity: T) => boolean): T[] {
    return this.findAll().filter(predicate);
  }

  // 按「某个字段等于某个值」筛选。
  // K 被约束为 keyof T，value 的类型精确到 T[K]——这就是类型安全的关键。
  where<K extends keyof T>(key: K, value: T[K]): T[] {
    return this.findAll().filter((entity) => entity[key] === value);
  }

  // 扩展：按某字段排序。key 必须是 T 的键。
  sortBy<K extends keyof T>(key: K, order: "asc" | "desc" = "asc"): T[] {
    const sign = order === "asc" ? 1 : -1;
    return this.findAll().sort((a, b) => {
      if (a[key] < b[key]) return -1 * sign;
      if (a[key] > b[key]) return 1 * sign;
      return 0;
    });
  }

  // 扩展：分页。返回 Page<T>，data 的类型随 T 变化。
  paginate(options: PageOptions): Page<T> {
    const { page, pageSize } = options;
    const all = this.findAll();
    const total = all.length;
    const start = (page - 1) * pageSize;
    return {
      data: all.slice(start, start + pageSize),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  get count(): number {
    return this.store.size;
  }
}

// ---- 演示：两种不同的实体，各建一个仓储 ----

interface User extends Entity {
  id: number;
  name: string;
  age: number;
  role: "admin" | "guest";
}

interface Product extends Entity {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

const users = new Repository<User>();
users.add({ id: 1, name: "Alice", age: 30, role: "admin" });
users.add({ id: 2, name: "Bob", age: 25, role: "guest" });
users.add({ id: 3, name: "Carol", age: 35, role: "guest" });

const products = new Repository<Product>();
products.add({ id: 101, title: "键盘", price: 199, inStock: true });
products.add({ id: 102, title: "鼠标", price: 89, inStock: false });
products.add({ id: 103, title: "显示器", price: 1299, inStock: true });

// getById：类型是 User | undefined
const alice = users.getById(1);
console.log("getById(1):", alice);

// where：key 只能是 User 的键，value 类型必须匹配。
const guests = users.where("role", "guest"); // ✓ "guest" 是合法的 role
console.log("where role=guest:", guests.map((u) => u.name));
// users.where("role", "boss"); // 报错：不是合法的 role 字面量
// users.where("email", "x"); // 报错：User 没有 email 字段

// findBy：任意谓词
const adults = users.findBy((u) => u.age >= 30);
console.log("findBy age>=30:", adults.map((u) => u.name));

// update：patch 是 Partial，且不能改 id
users.update(2, { age: 26 });
console.log("update(2) 后:", users.getById(2));

// where 在另一种实体上同样类型安全
const available = products.where("inStock", true);
console.log("在售商品:", available.map((p) => p.title));

// sortBy + paginate
console.log(
  "按 price 降序:",
  products.sortBy("price", "desc").map((p) => `${p.title}=${p.price}`)
);
console.log("用户分页(第1页,每页2条):", users.paginate({ page: 1, pageSize: 2 }));

// remove
users.remove(3);
console.log("删除后用户数:", users.count);

export {};
