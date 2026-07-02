// 文件：code/ch10/app.js
// 纯 JS 待办清单：无框架，用 DOM + 事件委托 + localStorage 实现。
// 在浏览器里打开 index.html 运行（不是 node）。

// ---- 1. 状态：一份 todo 数组，呼应第 3 章的数据模型 ----
// 每个 todo: { id: number, text: string, done: boolean }
const STORAGE_KEY = "ch10.todos";

/** 从 localStorage 读回数据；读不到或解析失败就返回空数组。 */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 把当前 todos 写回 localStorage。 */
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();
let filter = "all"; // "all" | "active" | "done"

// ---- 2. 抓取页面上的元素（只抓一次，缓存起来复用） ----
const input = document.querySelector("#new-todo");
const addBtn = document.querySelector("#add-btn");
const listEl = document.querySelector("#todo-list");
const countEl = document.querySelector("#count");
const filterBtns = document.querySelectorAll(".filters button[data-filter]");

// ---- 3. 渲染：把 todos 数组画成页面上的 <li> ----
function render() {
  // 按当前筛选条件过滤
  const visible = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  // 先清空列表，再重新生成
  listEl.innerHTML = "";

  if (visible.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "这里空空如也～";
    listEl.appendChild(li);
  } else {
    for (const t of visible) {
      listEl.appendChild(createItem(t));
    }
  }

  // 更新计数
  const left = todos.filter((t) => !t.done).length;
  countEl.textContent = `还剩 ${left} 项`;

  // 更新筛选按钮高亮
  for (const btn of filterBtns) {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  }
}

/** 根据一个 todo 对象，创建一个 <li> DOM 节点。 */
function createItem(todo) {
  const li = document.createElement("li");
  li.dataset.id = String(todo.id); // 把 id 存进 data-id，委托时靠它找回数据
  if (todo.done) li.classList.add("done");

  const span = document.createElement("span");
  span.className = "text";
  span.textContent = todo.text; // 用 textContent，不用 innerHTML —— 防 XSS

  const del = document.createElement("button");
  del.className = "del-btn";
  del.textContent = "删除";

  li.appendChild(span);
  li.appendChild(del);
  return li;
}

// ---- 4. 业务操作 ----
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return; // 空白不添加
  todos.push({ id: Date.now(), text: trimmed, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const t = todos.find((t) => t.id === id);
  if (t) {
    t.done = !t.done;
    saveTodos();
    render();
  }
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

// ---- 5. 事件绑定 ----

// 添加：点按钮
addBtn.addEventListener("click", () => {
  addTodo(input.value);
  input.value = "";
  input.focus();
});

// 添加：在输入框按回车
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo(input.value);
    input.value = "";
  }
});

// 列表点击：事件委托。只在父级 <ul> 上监听一次，
// 通过 event.target 判断点到的是哪个子元素。
listEl.addEventListener("click", (event) => {
  const li = event.target.closest("li[data-id]");
  if (!li) return; // 点到空白处，忽略
  const id = Number(li.dataset.id);

  if (event.target.classList.contains("del-btn")) {
    removeTodo(id); // 点到删除按钮
  } else {
    toggleTodo(id); // 点到别处 → 切换完成
  }
});

// 筛选：也用委托，绑在 .filters 容器上
document.querySelector(".filters").addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-filter]");
  if (!btn) return;
  filter = btn.dataset.filter;
  render();
});

// ---- 6. 首次渲染 ----
render();
