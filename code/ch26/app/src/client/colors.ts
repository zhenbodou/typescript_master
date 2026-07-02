// 文件：code/ch26/app/src/client/colors.ts
// 极简终端彩色输出：用 ANSI 转义码给文字上色，零依赖。
// 当输出不是 TTY（比如被管道到文件）时自动关闭颜色，避免污染。

const enabled = process.stdout.isTTY === true && process.env.NO_COLOR === undefined;

function wrap(open: number, close: number) {
  return (s: string) => (enabled ? `\x1b[${open}m${s}\x1b[${close}m` : s);
}

export const color = {
  green: wrap(32, 39),
  red: wrap(31, 39),
  yellow: wrap(33, 39),
  gray: wrap(90, 39),
  cyan: wrap(36, 39),
  bold: wrap(1, 22),
};
