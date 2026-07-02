// 文件：code/ch26/app/src/domain/task.ts
// 领域模型（domain model）—— 整个应用的「共同语言」。
// 后端（repository/service/http）和 CLI 客户端都围绕这几个类型说话。
// 沿用第 23/24 章的定义，一字未改：分层的好处就是「换存储、加界面都不用动模型」。

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

/** 列表查询的参数：done 筛选 + 分页。 */
export interface ListQuery {
  done?: boolean; // undefined 表示不筛选
  page: number; // 从 1 开始
  pageSize: number;
}

/** 列表查询的返回：数据 + 分页元信息。 */
export interface ListResult {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
}
