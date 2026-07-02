// 文件：code/ch22/debounce.test.ts
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { debounce } from "./debounce";
import { fetchUser } from "./user-service";

describe("debounce（用 fake timers 测定时器逻辑）", () => {
  beforeEach(() => {
    // 接管全局的 setTimeout/clearTimeout 等，让我们能"手动拨动时钟"
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 还原真实定时器，避免影响其他测试（测试要相互独立）
    vi.useRealTimers();
  });

  it("wait 之前不触发，wait 之后才触发一次", () => {
    const spy = vi.fn(); // 一个"间谍"函数：能记录被调了几次、参数是什么
    const debounced = debounce(spy, 200);

    debounced("a");
    expect(spy).not.toHaveBeenCalled(); // 还没到点

    vi.advanceTimersByTime(199);
    expect(spy).not.toHaveBeenCalled(); // 差 1ms

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1); // 到点，触发
    expect(spy).toHaveBeenCalledWith("a");
  });

  it("连续调用只触发最后一次（计时重置）", () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 200);

    debounced("first");
    vi.advanceTimersByTime(100);
    debounced("second"); // 重置计时
    vi.advanceTimersByTime(100); // 距离 second 只过了 100ms
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100); // 距离 second 满 200ms
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("second"); // 只保留最后一次的参数
  });

  it("cancel 后不再触发", () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 200);

    debounced("x");
    debounced.cancel();
    vi.advanceTimersByTime(500);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("fetchUser（用 mock 测异步 + 依赖外部）", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("成功时解析并返回用户", async () => {
    // 造一个假的 fetch：返回 ok，且 json() 给出预期数据
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: "Ada" }),
    } as Response);

    const user = await fetchUser(1, fakeFetch as unknown as typeof fetch);

    expect(user).toEqual({ id: 1, name: "Ada" });
    // 验证我们用对了 URL（行为验证，不只看返回值）
    expect(fakeFetch).toHaveBeenCalledWith(
      "https://api.example.com/users/1",
    );
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it("HTTP 失败时抛出带状态码的错误（用 rejects 断言）", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    await expect(
      fetchUser(99, fakeFetch as unknown as typeof fetch),
    ).rejects.toThrow("HTTP 404");
  });

  it("也可以用 spyOn 监视全局 fetch", async () => {
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 7, name: "Lin" }),
      } as Response);

    const user = await fetchUser(7); // 不传第二个参数，走全局 fetch
    expect(user).toEqual({ id: 7, name: "Lin" });
    expect(spy).toHaveBeenCalledOnce();
  });
});

// 快照测试小示例：把复杂对象的形状"拍照"存下来
describe("快照（snapshot）示例", () => {
  it("对象结构与快照一致", () => {
    const profile = {
      id: 1,
      name: "Ada",
      roles: ["admin", "author"],
    };
    expect(profile).toMatchInlineSnapshot(`
      {
        "id": 1,
        "name": "Ada",
        "roles": [
          "admin",
          "author",
        ],
      }
    `);
  });
});
