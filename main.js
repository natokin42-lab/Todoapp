// ====== DOM取得 ======
const formEl = document.getElementById("todo-form");
const inputEl = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");

// ====== localStorageキー ======
const STORAGE_KEY = "todos-v1";

// ====== データ ======
let todos = []; // { id, text, done }

// ====== 永続化 ======
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    // 最低限の形チェック（壊れたデータ対策）
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// ====== 関数 ======
function addTodo(text) {
  const trimmed = text.trim();
  if (trimmed === "") return;

  const todo = {
    id: Date.now(),
    text: trimmed,
    done: false,
  };

  todos.unshift(todo);
  saveTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
}

function toggleTodo(id) {
  for (const todo of todos) {
    if (todo.id === id) {
      todo.done = !todo.done;
      break;
    }
  }
  saveTodos();
}

function render() {
  listEl.innerHTML = "";

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = "item";

    // チェックボックス
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!todo.done;

    checkbox.addEventListener("change", () => {
      toggleTodo(todo.id);
      render();
    });

    // テキスト
    const span = document.createElement("span");
    span.textContent = todo.text;

    if (todo.done) {
      span.style.textDecoration = "line-through";
      span.style.color = "#999";
    }

    // 削除ボタン
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "×";
    delBtn.setAttribute("aria-label", "削除");

    delBtn.addEventListener("click", () => {
      deleteTodo(todo.id);
      render();
    });

    // 行レイアウト
    const row = document.createElement("div");

    row.appendChild(checkbox);
    row.appendChild(span);
    row.appendChild(delBtn);
    li.appendChild(row);
    listEl.appendChild(li);
  }
}

// ====== イベント ======
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  addTodo(inputEl.value);
  inputEl.value = "";
  inputEl.focus();

  render();
});

// ====== 起動時 ======
todos = loadTodos();
render();