// 文件：code/ch26/app/src/client/apiClient.ts
// CLI 用的 API 客户端：把「用 fetch 调后端」封装成有类型的方法，
// 让 cli.ts 只关心「命令 → 调哪个方法」，不必到处写 fetch/JSON 解析。
//
// fetch 是 Node 18+ 内置的全局函数（第 20 章 Web API / 第 22 章异步）。

import type {
  CreateTaskInput,
  ListResult,
  Task,
  UpdateTaskInput,
} from "../domain/task.js";

/** 当后端返回非 2xx 时抛出的错误，携带状态码与后端给的消息。 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  /** 统一的请求封装：拼 URL、发请求、按状态码分流、解析 JSON。 */
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
      });
    } catch (err) {
      // fetch 只有在「网络层」失败时才 reject（比如服务没启动、连不上）。
      throw new ApiError(0, `无法连接到服务 ${this.baseUrl}（后端启动了吗？）`);
    }

    // 204 No Content：删除成功，没有响应体。
    if (res.status === 204) return undefined as T;

    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;

    if (!res.ok) {
      // 后端统一错误格式是 { error, details? }。
      const msg = data?.error ?? `HTTP ${res.status}`;
      const detail = data?.details ? `：${data.details.join("；")}` : "";
      throw new ApiError(res.status, `${msg}${detail}`);
    }
    return data as T;
  }

  list(done?: boolean): Promise<ListResult> {
    const query = done === undefined ? "?pageSize=100" : `?done=${done}&pageSize=100`;
    return this.request<ListResult>(`/tasks${query}`);
  }

  create(input: CreateTaskInput): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  update(id: string, patch: UpdateTaskInput): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }

  remove(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, { method: "DELETE" });
  }
}
