// 文件：code/ch15/state-machine.ts
// 本章小项目：类型安全的有限状态机（Finite State Machine）。
// 以"订单状态"为例：pending → paid → shipped → delivered，且随时可 cancel。
// 运行：npx tsx ch15/state-machine.ts

// ---------- 1) 用联合字面量类型定义"状态"与"事件" ----------
type OrderState =
  | "pending" // 待支付
  | "paid" // 已支付
  | "shipped" // 已发货
  | "delivered" // 已送达
  | "cancelled"; // 已取消

type OrderEvent =
  | "pay" // 支付
  | "ship" // 发货
  | "deliver" // 送达
  | "cancel"; // 取消

// ---------- 2) 合法转移表：state -> (event -> nextState) ----------
// 用映射类型描述"每个状态下，哪些事件合法，会转到哪个状态"。
// 值为可选（?），表示该状态下没列出的事件都是【非法】的。
type TransitionTable = {
  [S in OrderState]: {
    [E in OrderEvent]?: OrderState;
  };
};

const transitions: TransitionTable = {
  pending: { pay: "paid", cancel: "cancelled" },
  paid: { ship: "shipped", cancel: "cancelled" },
  shipped: { deliver: "delivered" }, // 已发货就不能再取消了
  delivered: {}, // 终态：无任何合法转移
  cancelled: {}, // 终态
};

// transition 的返回结果：用可辨识联合（discriminated union）表达成功/失败
type TransitionResult =
  | { ok: true; from: OrderState; to: OrderState; event: OrderEvent }
  | { ok: false; from: OrderState; event: OrderEvent; reason: string };

// 历史记录的一条
interface HistoryEntry {
  from: OrderState;
  event: OrderEvent;
  to: OrderState;
  at: number; // 时间戳
}

// ---------- 3) StateMachine 类 ----------
class OrderStateMachine {
  #state: OrderState; // 用 # 私有，外部只能通过 getState() 读，不能乱改
  readonly #history: HistoryEntry[] = [];
  readonly #table: TransitionTable;

  constructor(initial: OrderState = "pending", table: TransitionTable = transitions) {
    this.#state = initial;
    this.#table = table;
  }

  // 只读地暴露当前状态
  getState(): OrderState {
    return this.#state;
  }

  // 只读地暴露历史（返回副本，防止外部篡改内部数组）
  getHistory(): readonly HistoryEntry[] {
    return this.#history.slice();
  }

  // 查询：当前状态下某事件是否合法
  can(event: OrderEvent): boolean {
    return this.#table[this.#state][event] !== undefined;
  }

  // 核心：尝试转移。合法则改状态、记历史、返回 ok:true；非法则不改任何东西、返回 ok:false。
  transition(event: OrderEvent): TransitionResult {
    const from = this.#state;
    const to = this.#table[from][event];

    if (to === undefined) {
      return {
        ok: false,
        from,
        event,
        reason: `状态「${from}」下不允许事件「${event}」`,
      };
    }

    this.#state = to;
    this.#history.push({ from, event, to, at: Date.now() });
    return { ok: true, from, to, event };
  }
}

// ---------- 4) 演示：一系列转移 ----------
const sm = new OrderStateMachine(); // 初始 pending
console.log("初始状态：", sm.getState()); // pending

const steps: OrderEvent[] = ["pay", "ship", "cancel", "deliver"];
for (const event of steps) {
  const result = sm.transition(event);
  if (result.ok) {
    console.log(`✅ ${result.from} --[${result.event}]--> ${result.to}`);
  } else {
    console.log(`❌ 拒绝：${result.reason}（状态保持 ${result.from}）`);
  }
}
// ✅ pending --[pay]--> paid
// ✅ paid --[ship]--> shipped
// ❌ 拒绝：状态「shipped」下不允许事件「cancel」（状态保持 shipped）
// ✅ shipped --[deliver]--> delivered

console.log("最终状态：", sm.getState()); // delivered
console.log("成功转移次数（历史长度）：", sm.getHistory().length); // 3

// can() 查询演示
console.log("delivered 还能 cancel 吗？", sm.can("cancel")); // false（终态）

// ---------- 5) 扩展练习：带进入/离开回调的状态机（onEnter / onLeave） ----------
// 思路：在 transition 成功改状态的前后，触发注册好的回调。这里给一个最小可运行版本。
type StateHook = (state: OrderState) => void;

class HookedStateMachine extends OrderStateMachine {
  #onEnter = new Map<OrderState, StateHook>();
  #onLeave = new Map<OrderState, StateHook>();

  onEnter(state: OrderState, hook: StateHook): this {
    this.#onEnter.set(state, hook);
    return this; // 返回 this 支持链式调用
  }
  onLeave(state: OrderState, hook: StateHook): this {
    this.#onLeave.set(state, hook);
    return this;
  }

  // 重写 transition：成功时在改状态前后触发回调
  override transition(event: OrderEvent): TransitionResult {
    const from = this.getState();
    const result = super.transition(event); // 复用父类的合法性判断与状态变更
    if (result.ok) {
      this.#onLeave.get(from)?.(from); // 离开旧状态
      this.#onEnter.get(result.to)?.(result.to); // 进入新状态
    }
    return result;
  }
}

console.log("\n--- 带回调的状态机 ---");
const hooked = new HookedStateMachine()
  .onEnter("paid", () => console.log("🔔 进入 paid：给财务发通知"))
  .onLeave("pending", () => console.log("🔔 离开 pending：清理待支付提醒"));

hooked.transition("pay");
// 🔔 离开 pending：清理待支付提醒
// 🔔 进入 paid：给财务发通知
console.log("hooked 当前状态：", hooked.getState()); // paid

export { OrderStateMachine, HookedStateMachine };
export type { OrderState, OrderEvent, TransitionResult };
