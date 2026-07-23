import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
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
  const [searchQuery, setSearchQuery] = useState("");
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
    let result = todos;

    switch (activeTab) {
      case "completed":
        result = result.filter((todo) => todo.completed);
        break;
      case "pending":
        result = result.filter((todo) => !todo.completed);
        break;
      default:
        break;
    }

    if (searchQuery.trim()) {
      result = result.filter((todo) =>
        todo.todoName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result;
  })();

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

  return (
    <>
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
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>

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
