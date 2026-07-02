# 文件：code/ch25/Dockerfile
# 多阶段构建（multi-stage build）：builder 阶段安装全部依赖并编译 TS，
# runner 阶段只带上编译产物和生产依赖，镜像更小、攻击面更少。

# ---------- 阶段 1：构建 ----------
FROM node:22-slim AS builder
WORKDIR /app

# 先只拷贝清单文件，利用 Docker 层缓存：依赖没变时不重复 npm ci。
COPY package.json package-lock.json ./
RUN npm ci

# 再拷贝源码并编译。假设 npm run build 会把 TS 编译到 dist/。
COPY . .
RUN npm run build

# ---------- 阶段 2：运行 ----------
FROM node:22-slim AS runner
WORKDIR /app

# 生产环境标记，很多库据此关闭调试、开启优化。
ENV NODE_ENV=production

# 只安装生产依赖（跳过 devDependencies，如 typescript / vitest）。
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 从 builder 阶段拷贝编译好的产物。
COPY --from=builder /app/dist ./dist

# 不用 root 运行：node 官方镜像自带非特权用户 node。
USER node

EXPOSE 3000

# 容器编排会向 PID 1 发 SIGTERM——我们的进程已处理它，可优雅关闭。
CMD ["node", "dist/graceful-shutdown.js"]
