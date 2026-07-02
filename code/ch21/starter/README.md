# starter · 生产级 TypeScript 项目脚手架

这是《JavaScript & TypeScript 从入门到精通》**第 21 章**的配套脚手架。
它把一个真实项目常用的工具链——**TypeScript + ESLint 9 + Prettier + tsup**——
预先配好，你以后开新项目照着抄即可。

## 目录结构

```
starter/
├── package.json          # 依赖与 npm scripts
├── tsconfig.json         # TypeScript 编译配置
├── tsup.config.ts        # 打包器配置
├── eslint.config.js      # ESLint 9 扁平配置
├── .prettierrc.json      # Prettier 格式化配置
├── .prettierignore       # Prettier 忽略清单
├── .editorconfig         # 跨编辑器基础风格
├── .gitignore
└── src/
    └── index.ts          # 源码入口
```

## 快速开始

本目录是一个**独立子项目**，有自己的 `package.json`，需要单独安装依赖：

```bash
cd code/ch21/starter
npm install
```

## 常用命令

```bash
npm run dev         # 监听模式：改动后自动重新打包并运行 dist/index.js
npm run build       # 打包到 dist/（含 .js / .d.ts / sourcemap）
npm run typecheck   # 只做类型检查，不产出文件（tsc --noEmit）
npm run lint        # 用 ESLint 检查代码问题
npm run lint:fix    # 自动修复能修的 lint 问题
npm run format      # 用 Prettier 格式化全部文件
npm run format:check# 只检查格式是否规范（CI 里用）
```

## 各工具分工

- **Prettier** 负责“长什么样”（缩进、引号、换行）——**格式**。
- **ESLint** 负责“有没有问题”（未使用变量、可疑写法）——**质量**。
- **tsc** 负责**类型检查**（`--noEmit`，只报错不产出）。
- **tsup** 负责**打包**（把 TS 编译并打包成可发布的 `dist/`）。

> tsc 和 tsup 各司其职：类型检查交给 `tsc --noEmit`，产物构建交给 tsup。
