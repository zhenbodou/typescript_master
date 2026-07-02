// 文件：code/ch18/09-optional-chaining-nullish.ts

// ---------- 可选链 ?. 与空值合并 ?? 如何与收窄配合 ----------

interface Address {
  city: string;
  zip?: string; // 可选
}
interface Profile {
  name: string;
  address?: Address; // 可选
}

// 可选链 ?.：链条中任意一环是 null / undefined，整体短路为 undefined。
function getCity(p: Profile | null | undefined): string {
  // p?.address?.city：p 或 address 缺失时结果为 undefined
  const city = p?.address?.city;
  // city 的类型是 string | undefined
  // 用 ?? 提供「仅在 null/undefined 时」生效的默认值
  return city ?? "未知城市";
}

// ⚠️ ?? 与 || 的区别：
// || 对所有「假值」(0, "", false) 都用默认值；
// ?? 只对 null / undefined 用默认值。
function withDefaults(count: number | undefined): void {
  console.log("|| :", count || 10); // count=0 时 → 10（可能不是你想要的）
  console.log("?? :", count ?? 10); // count=0 时 → 0（更精确）
}

// 可选链配合收窄：收窄之后 ?. 就不再需要
function describe(p: Profile | null): string {
  if (p == null) return "无资料";
  // 这里 p: Profile，但 address 仍是可选
  if (p.address) {
    // 收窄后 p.address: Address，直接访问不用 ?.
    return `${p.name} 住在 ${p.address.city}`;
  }
  return `${p.name}（地址未填）`;
}

// 可选链也能用于「可选方法调用」和「可选索引」
interface Api {
  onError?: (msg: string) => void;
}
function report(api: Api, msg: string): void {
  api.onError?.(msg); // 有才调用，没有就静默跳过
}

console.log(getCity({ name: "A", address: { city: "上海" } }));
console.log(getCity({ name: "B" }));
console.log(getCity(null));
withDefaults(0);
withDefaults(undefined);
console.log(describe({ name: "C", address: { city: "北京" } }));
console.log(describe({ name: "D" }));
report({ onError: (m) => console.log("错误回调:", m) }, "出错了");
report({}, "无回调，静默");
