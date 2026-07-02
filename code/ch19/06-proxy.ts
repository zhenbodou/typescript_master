// 文件：code/ch19/06-proxy.ts
// 演示：Proxy 拦截对象操作，实现"日志、校验、只读、响应式"等元编程能力。

// 1) 日志代理：任何读写都打印出来。
const target = { a: 1, b: 2 };
const logged = new Proxy(target, {
  get(obj, key, receiver) {
    console.log("读取", String(key));
    return Reflect.get(obj, key, receiver); // 用 Reflect 转发默认行为
  },
  set(obj, key, value, receiver) {
    console.log("写入", String(key), "=", value);
    return Reflect.set(obj, key, value, receiver);
  },
});
logged.a; // 触发 get
logged.b = 20; // 触发 set

// 2) 校验代理：拦截 set，拒绝非法值。
interface Account {
  balance: number;
}
function createAccount(): Account {
  return new Proxy({ balance: 0 } as Account, {
    set(obj, key, value) {
      if (key === "balance" && (typeof value !== "number" || value < 0)) {
        throw new RangeError("余额必须是非负数");
      }
      return Reflect.set(obj, key, value);
    },
  });
}
const acc = createAccount();
acc.balance = 100;
console.log("余额:", acc.balance);
try {
  acc.balance = -5;
} catch (e) {
  console.log("被拦截:", (e as Error).message);
}

// 3) 迷你响应式：属性变化时自动触发回调（Vue 响应式的雏形）。
function reactive<T extends object>(obj: T, onChange: (key: string) => void): T {
  return new Proxy(obj, {
    set(o, key, value, receiver) {
      const ok = Reflect.set(o, key, value, receiver);
      onChange(String(key));
      return ok;
    },
  });
}
const state = reactive({ count: 0 }, (key) => {
  console.log(`state.${key} 变了，重新渲染！当前 count =`, state.count);
});
state.count++;
state.count++;
