// 文件：code/ch04/mini-lodash.js
// 运行方式：作为模块被 demo.js 导入（node demo.js）
// 主题：本章小项目——用闭包与高阶函数手写一个函数式工具库

// ---------------------------------------------------------------
// once：让一个函数只真正执行一次，之后调用直接返回第一次的结果。
// 原理：用闭包保存 called 标志和 result，跨多次调用共享。
// ---------------------------------------------------------------
export function once(fn) {
  let called = false; // 被闭包记住的状态
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // 保留 this 与参数
    }
    return result;
  };
}

// ---------------------------------------------------------------
// memoize：缓存函数结果，相同参数不再重复计算。
// 原理：闭包里放一个 Map，键是参数序列化后的字符串。
// ---------------------------------------------------------------
export function memoize(fn) {
  const cache = new Map(); // 被闭包记住的缓存
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}

// ---------------------------------------------------------------
// partial：偏函数，预先"固定"前面若干参数，返回接收剩余参数的新函数。
// 原理：闭包记住 preset 参数，调用时拼接。
// ---------------------------------------------------------------
export function partial(fn, ...preset) {
  return function (...rest) {
    return fn.apply(this, [...preset, ...rest]);
  };
}

// ---------------------------------------------------------------
// curry：柯里化。把 fn(a, b, c) 变成可以 fn(a)(b)(c) 或 fn(a, b)(c) 调用。
// 原理：闭包不断累积已收到的参数，直到够数才真正执行。
// ---------------------------------------------------------------
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // 参数够了，执行
      return fn.apply(this, args);
    }
    // 参数不够，返回一个继续收集参数的函数
    return function (...more) {
      return curried.apply(this, [...args, ...more]);
    };
  };
}

// ---------------------------------------------------------------
// compose：从右到左组合函数。compose(f, g)(x) === f(g(x))
// pipe：从左到右组合函数，更符合阅读顺序。pipe(f, g)(x) === g(f(x))
// 原理：用 reduce 把一串函数"串"起来。
// ---------------------------------------------------------------
export function compose(...fns) {
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

export function pipe(...fns) {
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

// ---------------------------------------------------------------
// debounce：防抖。事件停止触发 wait 毫秒后才执行一次。
// 原理：闭包记住定时器 id，每次触发都清掉上一个、重设一个。
// ---------------------------------------------------------------
export function debounce(fn, wait) {
  let timer = null; // 被闭包记住的定时器
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  };
}

// ---------------------------------------------------------------
// throttle：节流。无论触发多频繁，每 wait 毫秒最多执行一次。
// 原理：闭包记住上次执行的时间戳。
// ---------------------------------------------------------------
export function throttle(fn, wait) {
  let last = 0; // 上次执行时间
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}
