// 文件：code/ch22/user-service.ts
// 一个依赖"外部 fetch"的异步函数。测试它时我们不想真的发网络请求，
// 而是用 vi.fn() / vi.spyOn 把 fetch mock 掉，只验证"我们的逻辑对不对"。

export interface User {
  id: number;
  name: string;
}

/**
 * 根据 id 拉取用户。约定：
 * - HTTP 成功（res.ok）：解析 JSON 并返回 User
 * - HTTP 失败（如 404）：抛出带状态码的错误
 * 注意：这里通过参数注入 fetch，默认用全局 fetch，
 * 这样测试时可以传入一个假的 fetch（依赖注入，最好测）。
 */
export async function fetchUser(
  id: number,
  fetchFn: typeof fetch = fetch,
): Promise<User> {
  const res = await fetchFn(`https://api.example.com/users/${id}`);
  if (!res.ok) {
    throw new Error(`请求用户 ${id} 失败：HTTP ${res.status}`);
  }
  return (await res.json()) as User;
}
