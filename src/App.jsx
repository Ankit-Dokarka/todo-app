import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import TodoModal from "./components/TodoModal";

export default function App() {
  const navigate = useNavigate();

  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [todos, setTodos] = useState(() => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUser]?.todos || [];
  });

  const [notifications, setNotifications] = useState(() => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUser]?.notifications || [];
  });

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
    users[currentUser].notifications = notifications;
    localStorage.setItem("users", JSON.stringify(users));
  }, [todos, notifications, isLoading]);

  const checkDeadlines = useCallback(() => {
    const now = new Date();
    let newNotificationsToAdd = [];
    let todosWereUpdated = false;

    const updatedTodos = todos.map((todo) => {
      if (!todo.time || todo.completed || todo.notif15MinSent) return todo;

      const dueTime = new Date(todo.time);
      const reminderTime = new Date(dueTime.getTime() - 15 * 60000);

      if (now >= reminderTime) {
        todosWereUpdated = true;

        const isOverdue = now > dueTime;

        newNotificationsToAdd.push({
          id: Date.now() + Math.random(),
          type: isOverdue ? "overdue" : "urgent",
          title: isOverdue
            ? `Overdue: ${todo.title}`
            : `Due Soon: ${todo.title}`,
          message: isOverdue
            ? `This task is past its deadline.`
            : `This task is due in less than 15 minutes.`,
          timestamp: new Date().toISOString(),
          read: false,
        });

        return { ...todo, notif15MinSent: true };
      }

      return todo;
    });

    if (todosWereUpdated) {
      setTodos(updatedTodos);
      setNotifications((prev) => [...newNotificationsToAdd, ...prev]);
    }
  }, [todos]);

  useEffect(() => {
    if (isLoading) return;

    checkDeadlines();

    const interval = setInterval(() => {
      checkDeadlines();
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoading, checkDeadlines]);

  const openTodoModal = (todo = null) => {
    setEditingTodo(todo);
    setIsTodoModalOpen(true);
  };

  const handleSaveTodo = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingTodo) {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === editingTodo.id
              ? {
                  ...t,
                  ...data,
                  updatedAt: new Date().toISOString(),
                  notif15MinSent: false,
                }
              : t,
          ),
        );
      } else {
        const newTodo = {
          id: Date.now(),
          ...data,
          completed: false,
          createdAt: new Date().toISOString(),
          notif15MinSent: false,
        };
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

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
        notifications={notifications}
        onNotifClick={markAllNotificationsAsRead}
      />

      <main className="app-main">
        <Outlet
          context={{
            todos,
            isLoading,
            openTodoModal,
            handleDeleteTodo,
            handleToggleTodo,
            notifications,
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
