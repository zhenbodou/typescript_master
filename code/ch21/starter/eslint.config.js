// 文件：code/ch21/starter/eslint.config.js
// ESLint 9 扁平配置（flat config）
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // 1) 全局忽略：构建产物、依赖目录不参与 lint
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  // 2) ESLint 官方推荐规则（针对普通 JS）
  js.configs.recommended,

  // 3) typescript-eslint 推荐规则（针对 TS）
  ...tseslint.configs.recommended,

  // 4) 项目自定义规则（放在推荐规则之后才能覆盖它们）
  {
    files: ['**/*.ts'],
    rules: {
      // 允许以下划线开头的参数/变量表示“故意不用”
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // 禁止 console.log，但允许 console.warn / console.error
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },

  // 5) 关闭所有与 Prettier 冲突的“格式类”规则，必须放在最后
  prettier,
);
