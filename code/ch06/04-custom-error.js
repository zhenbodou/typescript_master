// 文件：code/ch06/04-custom-error.js
// 运行方式：node 04-custom-error.js
// 主题：自定义错误类（extends Error）、设置 name、Error.cause 错误链
// 本文件用 export 导出，供其它文件复用（ESM）

// 1) 一个基础的自定义错误：继承 Error，设置 name
export class ValidationError extends Error {
  constructor(message, field) {
    super(message); // 一定要调用 super，把 message 传给 Error
    this.name = "ValidationError"; // 覆盖默认的 "Error"
    this.field = field; // 自定义字段：出错的字段名
  }
}

// 2) 再来一个，携带更多结构化信息
export class HttpError extends Error {
  constructor(status, message, options) {
    super(message, options); // options 可含 { cause }
    this.name = "HttpError";
    this.status = status;
  }
}

// —— 演示区（作为主模块运行时才执行）——
function demo() {
  // A) 抛出并捕获自定义错误
  function checkUser(user) {
    if (!user.name) {
      throw new ValidationError("用户名不能为空", "name");
    }
    if (typeof user.age !== "number") {
      throw new ValidationError("年龄必须是数字", "age");
    }
    return true;
  }

  try {
    checkUser({ name: "" });
  } catch (e) {
    console.log("name        :", e.name); // ValidationError
    console.log("是 Error 吗  :", e instanceof Error); // true
    console.log("是自定义类吗 :", e instanceof ValidationError); // true
    console.log("出错字段     :", e.field); // name
    console.log("message     :", e.message);
  }

  // B) 错误链：底层错误 cause 被上层包裹
  function loadUserFromApi() {
    try {
      // 假装这里网络请求失败了
      throw new Error("ECONNREFUSED 127.0.0.1:5432");
    } catch (lowLevel) {
      // 把“看不懂的底层错误”包装成“业务能懂的错误”，但保留原因
      throw new HttpError(503, "服务暂时不可用", { cause: lowLevel });
    }
  }

  try {
    loadUserFromApi();
  } catch (e) {
    console.log("\n业务层错误 :", e.name, e.status, "->", e.message);
    console.log("底层原因   :", e.cause.message); // 顺着 cause 一路追踪
  }
}

// 只有直接运行本文件时才跑 demo；被 import 时不跑
if (import.meta.url === `file://${process.argv[1]}`) {
  demo();
}
