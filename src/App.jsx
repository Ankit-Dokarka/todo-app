import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import ConfirmationModal from "./components/ConfirmationModal";

import { FiCheckSquare, FiTrash2, FiLogOut } from "react-icons/fi";

function App() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState(() => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUser]?.todos || [];
  });
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });
  const [confirmCallback, setConfirmCallback] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!currentUser || !users[currentUser]) return;

    users[currentUser].todos = todos;
    localStorage.setItem("users", JSON.stringify(users));
  }, [todos]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const addTodo = () => {
    if (!inputValue.trim()) return;

    if (editingId !== null) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId ? { ...todo, todoName: inputValue } : todo,
        ),
      );
      setEditingId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        todoName: inputValue,
        completed: false,
      };
      setTodos((prev) => [newTodo, ...prev]);
    }
    setInputValue("");
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const editTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo.completed) {
      setInputValue("");
      return;
    } else {
      setInputValue(todo.todoName);
    }
    setEditingId(id);
  };

  const handleTabs = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = (() => {
    switch (activeTab) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "pending":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  })();

  const deleteAllTodos = () => {
    setTodos([]);
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const deleteCompletedTodos = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const openConfirmationModal = (title, message, callback) => {
    setModalConfig({ title, message });
    setConfirmCallback(() => callback);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (confirmCallback) confirmCallback();
    setIsModalOpen(false);
  };

  const handleDeleteTodoClick = (id) => {
    openConfirmationModal(
      "Delete Todo?",
      "Are you sure you want to delete this task? This action cannot be undone.",
      () => deleteTodo(id),
    );
  };

  const handleDeleteAllClick = () => {
    if (todos.length === 0) return;
    openConfirmationModal(
      "Delete All Tasks?",
      "Warning: This will delete every task in your list. This action cannot be undone.",
      deleteAllTodos,
    );
  };

  const handleDeleteCompletedClick = () => {
    if (!todos.some((todo) => todo.completed)) return;
    openConfirmationModal(
      "Delete Completed Tasks?",
      "This will permanently remove all completed tasks. This action cannot be undone.",
      deleteCompletedTodos,
    );
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <FiCheckSquare size={24} />
          <h1>Task Manager</h1>
        </div>

        <div className="header-actions">
          <button
            className="header-action-btn"
            onClick={handleDeleteCompletedClick}
          >
            Delete completed
          </button>
          <button className="header-action-btn" onClick={handleDeleteAllClick}>
            <FiTrash2 /> Delete all
          </button>

          <button
            className="header-action-btn logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-header">
          <h2>My Tasks</h2>
          <span className="date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <section className="input-section">
          <TodoInput
            addTodo={addTodo}
            inputValue={inputValue}
            setInputValue={setInputValue}
            editId={editingId}
          />
        </section>

        <section className="list-section">
          <div className="list-toolbar">
            <h3 className="section-title">TodoList</h3>

            <div className="filter-dropdown-wrapper">
              <select
                className="filter-dropdown"
                value={activeTab}
                onChange={(e) => handleTabs(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <TodoList
            todos={filteredTodos}
            deleteTodo={handleDeleteTodoClick}
            editTodo={editTodo}
            handleToggleTodo={handleToggleTodo}
          />
        </section>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
}

export default App;
