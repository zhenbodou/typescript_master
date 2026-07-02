// 文件：code/ch07/06-weak.js
// WeakMap / WeakSet：弱引用、私有数据、缓存、为何不可迭代

// 1) WeakMap 的键必须是对象，且是“弱引用”——
//    如果这个对象在别处没人用了，它连同 WeakMap 里的记录都会被垃圾回收。
const wm = new WeakMap();
let key = { id: 1 };
wm.set(key, "关联数据");
console.log("wm.get:", wm.get(key)); // "关联数据"
console.log("wm.has:", wm.has(key)); // true
// 注意：WeakMap 没有 size、没有 keys()/values()、不能 for...of，
// 因为它的内容随时可能被 GC 清掉，遍历结果不确定，所以语言干脆禁止遍历。

// 2) 经典用途：给对象存“私有数据”，外部拿不到
const privateData = new WeakMap();
class BankAccount {
  constructor(balance) {
    privateData.set(this, { balance }); // 真正的余额藏在模块级 WeakMap 里
  }
  deposit(amount) {
    privateData.get(this).balance += amount;
  }
  getBalance() {
    return privateData.get(this).balance;
  }
}
const acc = new BankAccount(100);
acc.deposit(50);
console.log("余额:", acc.getBalance()); // 150
console.log("外部无法直接访问 balance:", acc.balance); // undefined

// 3) 经典用途：缓存（cache）。对象被回收时，缓存自动释放，不会内存泄漏。
const cache = new WeakMap();
function compute(objInput) {
  if (cache.has(objInput)) {
    return cache.get(objInput) + "（来自缓存）";
  }
  const result = `对 ${objInput.name} 的计算结果`;
  cache.set(objInput, result);
  return result;
}
const config = { name: "配置A" };
console.log(compute(config)); // 首次计算
console.log(compute(config)); // 命中缓存

// 4) WeakSet：只存对象、弱引用、不可迭代。常用于“打标记”。
const visited = new WeakSet();
const node = { value: 1 };
visited.add(node);
console.log("visited.has(node):", visited.has(node)); // true

export { BankAccount };
