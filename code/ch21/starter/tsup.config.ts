// 文件：code/ch21/starter/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // 入口文件
  format: ['esm'], // 输出 ES Module
  target: 'es2022', // 目标语法版本
  dts: true, // 生成 .d.ts 类型声明文件
  sourcemap: true, // 生成 source map，便于调试
  clean: true, // 每次构建前清空 dist
  minify: false, // 库通常不压缩，交给使用方按需处理
});
