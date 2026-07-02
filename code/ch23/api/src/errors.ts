// 文件：code/ch23/api/src/errors.ts
// 自定义错误类型：让「业务错误」携带一个 HTTP 状态码，
// 这样统一错误处理中间件就能据此决定返回什么状态码。

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

/** 404：资源不存在。 */
export class NotFoundError extends HttpError {
  constructor(message = "资源不存在") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

/** 400：请求校验失败，可携带具体字段错误列表。 */
export class ValidationError extends HttpError {
  details: string[];
  constructor(details: string[]) {
    super(400, "请求校验失败");
    this.name = "ValidationError";
    this.details = details;
  }
}
