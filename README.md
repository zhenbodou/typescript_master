# JavaScript & TypeScript 从入门到精通

一本面向**零基础**读者、系统讲解 JavaScript 与 TypeScript 直至精通的中文教程。覆盖：JS 语言核心 → JS 进阶 → Node.js 运行时 → TypeScript 类型系统 → 工程化 → 后端开发 → 综合大项目。每章都配详尽示例与一个可运行的小项目。

## 目录结构

```
master_book/
├── book.toml        # mdBook 配置
├── src/             # 书稿（Markdown），mdBook 的内容源
│   ├── SUMMARY.md   # 目录
│   ├── preface.md   # 前言
│   └── chNN.md      # 各章正文
└── code/            # 各章配套的可运行代码
    ├── package.json
    ├── tsconfig.json
    └── chNN/        # 第 NN 章的示例与小项目
```

## 阅读电子书

需要 [mdBook](https://rust-lang.github.io/mdBook/)（用 `cargo install mdbook` 安装）。

```bash
# 在 master_book/ 目录下
mdbook serve --open   # 本地起服务并自动打开浏览器，边看边热更新
mdbook build          # 生成静态站点到 book/ 目录
```

## 运行示例代码

需要 [Node.js](https://nodejs.org/)（建议 v20+）。

```bash
cd code
npm install                 # 安装 tsx / typescript / vitest 等依赖

# 运行某个 JS 示例
node ch01/01-variables.js

# 运行某个 TS 示例（无需先编译，tsx 直接执行）
npx tsx ch13/01-hello.ts

# 运行测试
npx vitest run
```

> 书中每段代码都会标注它对应 `code/` 下的哪个文件，方便你一边读一边跑。

## 如何学习本书

见 [前言 · 如何使用本书](src/preface.md)。建议顺序阅读、每章都动手敲一遍代码并完成章末小项目。
