import { useEffect, useState } from "react";
// import { FiTrash2 } from "react-icons/fi";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Home.css";

export default function Home() {
  const [todos, setTodos] = useState(() => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUser]?.todos || [];
  });

  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });
  const [confirmCallback, setConfirmCallback] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!currentUser || !users[currentUser]) return;

    users[currentUser].todos = todos;
    localStorage.setItem("users", JSON.stringify(users));
  }, [todos, isLoading]);

  const addTodo = () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
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
      setIsLoading(false);
    }, 600);
  };

  const deleteTodo = (id) => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setIsLoading(false);
    }, 600);
  };

  const editTodo = (id) => {
    if (isLoading) return;
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
    if (isLoading) return;
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

  // const deleteAllTodos = () => {
  //   setTodos([]);
  // };

  // const deleteCompletedTodos = () => {
  //   setTodos((prev) => prev.filter((todo) => !todo.completed));
  // };

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
      "Are you sure you want to delete this todo? This action cannot be undone.",
      () => deleteTodo(id),
    );
  };

  // const handleDeleteAllClick = () => {
  //   if (todos.length === 0) return;
  //   openConfirmationModal(
  //     "Delete All Todos?",
  //     "Warning: This will delete every todo in your list. This action cannot be undone.",
  //     deleteAllTodos,
  //   );
  // };

  // const handleDeleteCompletedClick = () => {
  //   if (!todos.some((todo) => todo.completed)) return;
  //   openConfirmationModal(
  //     "Delete Completed Todos?",
  //     "This will permanently remove all completed todos. This action cannot be undone.",
  //     deleteCompletedTodos,
  //   );
  // };

  return (
    <>
      <div className="main-header">
        <h2>My Todos</h2>
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
          isDisabled={isLoading}
        />
      </section>

      <section className="list-section">
        <div className="list-toolbar">
          <h3 className="section-title">TodoList</h3>

          <div className="list-actions-group">
            <div className="filter-dropdown-wrapper">
              <select
                className="filter-dropdown"
                value={activeTab}
                onChange={(e) => handleTabs(e.target.value)}
                disabled={isLoading}
              >
                <option value="all">All Todos</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* <div className="list-actions">
              <button
                className="list-action-btn"
                onClick={handleDeleteCompletedClick}
                disabled={isLoading}
              >
                Clear Completed
              </button>
              <button
                className="list-action-btn danger"
                onClick={handleDeleteAllClick}
                disabled={isLoading}
              >
                <FiTrash2 /> Delete All
              </button>
            </div> */}
          </div>
        </div>

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDeleteTodoClick}
          editTodo={editTodo}
          handleToggleTodo={handleToggleTodo}
          isLoading={isLoading}
        />
      </section>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </>
  );
}
