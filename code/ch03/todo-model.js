// 文件：code/ch03/todo-model.js
// 运行方式：node todo-model.js
// 本章小项目：待办清单（Todo List）数据模型（纯数据层，不做交互 UI）
//
// 设计原则：所有操作都是"纯函数"——不修改传入的旧数组，而是返回一个新数组。
// 这样数据流清晰、可预测，也方便后面章节做撤销/重做、状态管理等功能。

// ---------- 数据形状 ----------
// 一条待办事项（todo item）长这样：
// {
//   id: number,        // 唯一标识
//   title: string,     // 标题
//   done: boolean,     // 是否完成
//   createdAt: number, // 创建时间（时间戳，毫秒）
// }

// ---------- 1) 生成 id ----------
// 简单起见，用"当前最大 id + 1"。真实项目里会用 uuid（第 24 章）。
function nextId(todos) {
  // reduce 找出最大的 id；空数组时初始值为 0
  const maxId = todos.reduce((max, t) => (t.id > max ? t.id : max), 0);
  return maxId + 1;
}

// ---------- 2) 添加 ----------
// 返回"追加了新项"的新数组，不改原数组。
function addTodo(todos, title) {
  const newTodo = {
    id: nextId(todos),
    title,
    done: false,
    createdAt: Date.now(),
  };
  return [...todos, newTodo]; // 用展开运算符拼出新数组
}

// ---------- 3) 删除 ----------
// filter 掉指定 id，返回新数组。
function removeTodo(todos, id) {
  return todos.filter((t) => t.id !== id);
}

// ---------- 4) 标记完成 / 切换状态 ----------
// map 出一个新数组：命中的那一项用展开生成新对象并翻转 done，其余原样返回。
function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

// ---------- 5) 按状态筛选 ----------
// status: "all" | "active"(未完成) | "completed"(已完成)
function filterTodos(todos, status) {
  switch (status) {
    case "active":
      return todos.filter((t) => !t.done);
    case "completed":
      return todos.filter((t) => t.done);
    default:
      return todos; // "all"
  }
}

// ---------- 6) 统计未完成数量 ----------
function countActive(todos) {
  return todos.reduce((n, t) => (t.done ? n : n + 1), 0);
}

// ---------- 7) 按创建时间排序 ----------
// order: "asc"(旧->新) | "desc"(新->旧)。先拷贝再 sort，避免改原数组。
function sortByCreatedAt(todos, order = "asc") {
  const sign = order === "desc" ? -1 : 1;
  return [...todos].sort((a, b) => (a.createdAt - b.createdAt) * sign);
}

// ---------- 8) 格式化打印成好看的清单 ----------
function formatTodos(todos) {
  if (todos.length === 0) return "（清单为空）";

  const lines = todos.map((t) => {
    const box = t.done ? "[x]" : "[ ]"; // 完成打勾
    const idText = `#${t.id}`.padEnd(4, " "); // 对齐 id
    return `${box} ${idText} ${t.title}`;
  });

  const active = countActive(todos);
  const total = todos.length;
  const footer = `—— 共 ${total} 项，未完成 ${active} 项 ——`;

  return [...lines, footer].join("\n");
}

// ============================================================
// 下面用 console.log 演示各操作（这一段是"使用"，上面是"模型"）
// ============================================================

console.log("===== 待办清单数据模型演示 =====\n");

// 从空清单开始，链式地添加几项
let todos = [];
todos = addTodo(todos, "学习字符串方法");
todos = addTodo(todos, "学习数组方法");
todos = addTodo(todos, "完成本章小项目");
todos = addTodo(todos, "预习第 4 章");

console.log("【添加 4 项后】");
console.log(formatTodos(todos));
console.log();

// 标记第 1、2 项完成
todos = toggleTodo(todos, 1);
todos = toggleTodo(todos, 2);
console.log("【标记 #1、#2 完成后】");
console.log(formatTodos(todos));
console.log();

// 删除第 4 项
todos = removeTodo(todos, 4);
console.log("【删除 #4 后】");
console.log(formatTodos(todos));
console.log();

// 筛选：只看未完成
console.log("【只看未完成 active】");
console.log(formatTodos(filterTodos(todos, "active")));
console.log();

// 筛选：只看已完成
console.log("【只看已完成 completed】");
console.log(formatTodos(filterTodos(todos, "completed")));
console.log();

// 统计
console.log("【统计】未完成数量：", countActive(todos));
console.log();

// 按创建时间降序（新的在上）
console.log("【按创建时间降序】");
console.log(formatTodos(sortByCreatedAt(todos, "desc")));
console.log();

// 证明原数组未被破坏：所有操作都返回了新数组
console.log("【当前 todos 仍是最近一次赋值的结果，共】", todos.length, "项");

// 导出这些纯函数，方便第 4、23 章复用（模块化见第 9 章）
export {
  nextId,
  addTodo,
  removeTodo,
  toggleTodo,
  filterTodos,
  countActive,
  sortByCreatedAt,
  formatTodos,
};
