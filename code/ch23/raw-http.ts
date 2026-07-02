// 文件：code/ch23/raw-http.ts
// 用 Node 内置的 node:http 手写一个最小 HTTP 服务器，理解框架背后发生了什么。
// 运行：npx tsx ch23/raw-http.ts
// 然后另开终端：
//   curl http://localhost:3000/hello
//   curl -X POST http://localhost:3000/echo -H "Content-Type: application/json" -d '{"name":"张三"}'

import http from "node:http";

// createServer 接收一个「请求处理函数」，每来一个请求就调用它一次。
// req 是 IncomingMessage（可读流），res 是 ServerResponse（可写流）。
const server = http.createServer((req, res) => {
  // req.method 是 HTTP 方法字符串（"GET" / "POST" ...）。
  // req.url 是路径 + 查询字符串，比如 "/hello?x=1"。
  const { method, url } = req;

  // 最原始的「路由」：就是一堆 if/switch，根据 method + 路径分发。
  if (method === "GET" && url === "/hello") {
    // 手动设置状态码与响应头，再写 body。
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // body 必须自己序列化成字符串（或 Buffer）。
    res.end(JSON.stringify({ message: "你好，世界" }));
    return;
  }

  if (method === "POST" && url === "/echo") {
    // 关键点：请求 body 不是一次性就位的，而是「流式」分块到达的。
    // 我们要监听 data 事件收集每一块 chunk，end 事件表示收完了。
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      try {
        // 我们约定 body 是 JSON，所以要手动 parse。框架会替我们做这件事。
        const data = raw ? JSON.parse(raw) : {};
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ youSent: data }));
      } catch {
        // JSON 解析失败 → 400 Bad Request。
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "请求体不是合法 JSON" }));
      }
    });
    return;
  }

  // 所有没匹配上的路径 → 404 Not Found。
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: "Not Found" }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`原始 HTTP 服务器已启动：http://localhost:${PORT}`);
});
