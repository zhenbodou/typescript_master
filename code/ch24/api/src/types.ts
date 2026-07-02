// 文件：code/ch24/api/src/types.ts
// 领域模型（domain model）——沿用第 23 章的定义，让上层几乎不用改。

/** 一个任务（Task）在系统中的完整形态。 */
export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string; // ISO 8601 字符串，例如 "2026-07-02T08:00:00.000Z"
}

/** 创建任务时，客户端允许提交的字段（id / createdAt 由服务端生成）。 */
export interface CreateTaskInput {
  title: string;
  done?: boolean;
}

/** 更新任务时，客户端可以只提交部分字段（PATCH 语义）。 */
export interface UpdateTaskInput {
  title?: string;
  done?: boolean;
}
