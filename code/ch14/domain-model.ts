// 文件：code/ch14/domain-model.ts
// 本章小项目：电商领域模型建模
// 用 interface / type / 联合 / 交叉 / 可辨识联合，为一个小型电商域建模。

// ---------- 一、基础实体：interface + 交叉复用 ----------

// 公共字段抽成小接口，靠交叉/继承拼装
interface HasId {
  readonly id: string;
}
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// 用户
interface User extends HasId, Timestamped {
  name: string;
  email: string;
  vipLevel?: 1 | 2 | 3; // 可选 + 字面量联合
}

// 商品
interface Product extends HasId, Timestamped {
  title: string;
  price: number; // 单位：分，避免浮点误差
  stock: number;
}

// ---------- 二、可辨识联合：支付方式 Payment ----------
// 每种支付方式字段不同，用公共标签字段 method 辨识

interface AlipayPayment {
  method: "alipay";
  account: string; // 支付宝账号
}
interface WechatPayment {
  method: "wechat";
  openId: string; // 微信 openId
}
interface CardPayment {
  method: "card";
  cardNumber: string;
  bank: string;
}
interface CashOnDelivery {
  method: "cod"; // 货到付款，无需额外字段
}

type Payment = AlipayPayment | WechatPayment | CardPayment | CashOnDelivery;

// 对 Payment 做完全穷尽处理，返回展示文案
function describePayment(p: Payment): string {
  switch (p.method) {
    case "alipay":
      return `支付宝支付（账号 ${maskTail(p.account)}）`;
    case "wechat":
      return `微信支付（openId ${maskTail(p.openId)}）`;
    case "card":
      return `${p.bank}银行卡支付（尾号 ${p.cardNumber.slice(-4)}）`;
    case "cod":
      return "货到付款";
    default:
      return assertNever(p); // 漏掉任何一种 method，这里就会编译报错
  }
}

// ---------- 三、可辨识联合：通知 Notification ----------

interface EmailNotification {
  channel: "email";
  to: string;
  subject: string;
  body: string;
}
interface SmsNotification {
  channel: "sms";
  phone: string;
  text: string; // 短信有长度限制
}
interface PushNotification {
  channel: "push";
  deviceToken: string;
  title: string;
  badge: number;
}

type Notification =
  | EmailNotification
  | SmsNotification
  | PushNotification;

function renderNotification(n: Notification): string {
  switch (n.channel) {
    case "email":
      return `邮件 → ${n.to}｜主题：${n.subject}`;
    case "sms":
      return `短信 → ${n.phone}｜${truncate(n.text, 10)}`;
    case "push":
      return `推送 → 设备 ${maskTail(n.deviceToken)}｜${n.title}（角标 ${n.badge}）`;
    default:
      return assertNever(n);
  }
}

// ---------- 四、可辨识联合：API 响应 ----------
// 用泛型 + 可辨识联合建模"要么成功、要么失败"

type ApiResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; code: number; message: string };

function handleResult<T>(res: ApiResult<T>): string {
  switch (res.status) {
    case "ok":
      return `成功：${JSON.stringify(res.data)}`;
    case "error":
      return `失败[${res.code}]：${res.message}`;
    default:
      return assertNever(res);
  }
}

// ---------- 工具函数 ----------

// exhaustiveness 检查：参数类型必须是 never，否则说明联合没被穷尽
function assertNever(x: never): never {
  throw new Error(`未处理的分支：${JSON.stringify(x)}`);
}

function maskTail(s: string): string {
  if (s.length <= 3) return "***";
  return s.slice(0, 3) + "***";
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// ---------- 演示 ----------

const payments: Payment[] = [
  { method: "alipay", account: "alice@example.com" },
  { method: "wechat", openId: "ox_abc123def" },
  { method: "card", cardNumber: "6222021234567890", bank: "招商" },
  { method: "cod" },
];

console.log("=== 支付方式 ===");
for (const p of payments) console.log("-", describePayment(p));

const notifications: Notification[] = [
  { channel: "email", to: "bob@example.com", subject: "订单已发货", body: "..." },
  { channel: "sms", phone: "13800001111", text: "您的验证码是 8848，请勿泄露。" },
  { channel: "push", deviceToken: "dtk_998877", title: "限时秒杀", badge: 3 },
];

console.log("\n=== 通知渲染 ===");
for (const n of notifications) console.log("-", renderNotification(n));

console.log("\n=== API 响应 ===");
const ok: ApiResult<Product> = {
  status: "ok",
  data: {
    id: "p1",
    title: "机械键盘",
    price: 29900,
    stock: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
const fail: ApiResult<Product> = { status: "error", code: 404, message: "商品不存在" };
console.log("-", handleResult(ok).slice(0, 40) + "...");
console.log("-", handleResult(fail));

// 让 User 类型也被"用到"，避免未使用告警，同时演示实体建模
const alice: User = {
  id: "u1",
  name: "Alice",
  email: "alice@example.com",
  vipLevel: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};
console.log(`\n用户 ${alice.name}（VIP${alice.vipLevel ?? 0}）建模完成。`);

export {};
