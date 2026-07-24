import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiSearch, FiPlus } from "react-icons/fi";
import TodoList from "../components/TodoList";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Home.css";

export default function Home() {
  const {
    todos,
    isLoading,
    openTodoModal,
    handleDeleteTodo,
    handleToggleTodo,
  } = useOutletContext();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });
  const [confirmCallback, setConfirmCallback] = useState(null);

  const handleTabs = (tab) => setActiveTab(tab);

  const filteredTodos = (() => {
    let result = todos;
    switch (activeTab) {
      case "completed":
        result = result.filter((t) => t.completed);
        break;
      case "pending":
        result = result.filter((t) => !t.completed);
        break;
      default:
        break;
    }
    if (searchQuery.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
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
      () => handleDeleteTodo(id),
    );
  };

  return (
    <>
      <section className="list-section">
        <div className="list-toolbar">
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
          editTodo={openTodoModal}
          handleToggleTodo={handleToggleTodo}
          isLoading={isLoading}
        />
      </section>

      <button className="fab-add-todo" onClick={() => openTodoModal(null)}>
        <FiPlus />
      </button>

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
