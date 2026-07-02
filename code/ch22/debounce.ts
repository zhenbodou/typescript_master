// 文件：code/ch22/debounce.ts
// debounce（防抖）：在"最后一次调用"之后等待 wait 毫秒才真正执行。
// 期间如果又被调用，计时重新开始。典型用途：搜索框输入、窗口 resize。
// 这类"带定时器副作用"的函数，正是 fake timers + spy 的用武之地。

export type Debounced<Args extends unknown[]> = ((...args: Args) => void) & {
  /** 取消尚未触发的那次延迟调用 */
  cancel: () => void;
};

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Args): void => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  };

  debounced.cancel = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
