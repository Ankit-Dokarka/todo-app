import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import TodoModal from "./components/TodoModal";

export default function App() {
  const navigate = useNavigate();

  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [todos, setTodos] = useState(() => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUser]?.todos || [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
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

  const openTodoModal = (todo = null) => {
    setEditingTodo(todo);
    setIsTodoModalOpen(true);
  };

  const handleSaveTodo = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingTodo) {
        setTodos((prev) =>
          prev.map((t) => (t.id === editingTodo.id ? { ...t, ...data } : t)),
        );
      } else {
        const newTodo = { id: Date.now(), ...data, completed: false };
        setTodos((prev) => [newTodo, ...prev]);
      }
      setIsLoading(false);
      setIsTodoModalOpen(false);
      setEditingTodo(null);
    }, 600);
  };

  const handleDeleteTodo = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setIsLoading(false);
    }, 600);
  };

  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Header
        handleLogout={handleLogout}
        onAddClick={() => openTodoModal(null)}
      />

      <main className="app-main">
        <Outlet
          context={{
            todos,
            isLoading,
            openTodoModal,
            handleDeleteTodo,
            handleToggleTodo,
          }}
        />
      </main>

      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => {
          setIsTodoModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </div>
  );
}
