// 文件：code/ch08/06-promise-combinators.js
// 运行方式：node 06-promise-combinators.js
// 主题：Promise.all / allSettled / race / any 四个组合器

function task(name, ms, ok = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ok) resolve(`${name} 成功(${ms}ms)`);
      else reject(new Error(`${name} 失败(${ms}ms)`));
    }, ms);
  });
}

async function main() {
  // 1) Promise.all：全部成功才成功，返回结果数组（顺序对应输入）；任一失败立即整体失败
  const allResult = await Promise.all([
    task("A", 100),
    task("B", 200),
    task("C", 50),
  ]);
  console.log("① all（全部成功）：", allResult);

  // all 的“短路失败”：只要一个 reject，整体立刻 reject
  try {
    await Promise.all([task("D", 100), task("E", 50, false)]);
  } catch (e) {
    console.log("② all 遇到失败就整体失败：", e.message);
  }

  // 2) Promise.allSettled：等所有都“落定”，永不失败，返回每个的状态
  const settled = await Promise.allSettled([
    task("F", 80),
    task("G", 40, false),
  ]);
  console.log("③ allSettled（逐个报告状态）：");
  for (const r of settled) {
    if (r.status === "fulfilled") console.log("   ✅", r.value);
    else console.log("   ❌", r.reason.message);
  }

  // 3) Promise.race：谁先“落定”（不管成功还是失败）就用谁的结果
  try {
    const raced = await Promise.race([task("慢", 200), task("快", 30)]);
    console.log("④ race（最先落定者胜出）：", raced);
  } catch (e) {
    console.log("④ race 最先落定的是失败：", e.message);
  }

  // 4) Promise.any：第一个“成功”者胜出；全部失败才失败（AggregateError）
  const anyResult = await Promise.any([
    task("H", 100, false),
    task("I", 60), // 第一个成功的
    task("J", 30, false),
  ]);
  console.log("⑤ any（第一个成功者胜出）：", anyResult);
}

main();
