// 文件：code/ch14/03-extends-merge.ts
// 接口继承（extends，可多继承）与声明合并（declaration merging）

// 1) 单继承：Admin 拥有 Person 的全部成员，再加自己的
interface Person {
  name: string;
  age: number;
}

interface Admin extends Person {
  role: "admin";
  permissions: string[];
}

const boss: Admin = {
  name: "Boss",
  age: 40,
  role: "admin",
  permissions: ["read", "write", "delete"],
};
console.log(`${boss.name} 拥有权限：${boss.permissions.join(", ")}`);

// 2) 多继承：一个接口可以同时继承多个接口
interface HasId {
  id: number;
}
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}
interface Article extends HasId, Timestamped {
  title: string;
}

const post: Article = {
  id: 100,
  title: "TypeScript 入门",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-07-01"),
};
console.log(`文章 #${post.id}《${post.title}》创建于 ${post.createdAt.getFullYear()}`);

// 3) 声明合并：同名 interface 会自动合并成一个
interface Box {
  width: number;
}
interface Box {
  height: number;
}
// 现在 Box 同时拥有 width 和 height
const b: Box = { width: 10, height: 20 };
console.log("盒子面积：", b.width * b.height); // 200

export {};
