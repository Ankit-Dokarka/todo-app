import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import "./TodoList.css";

const lightColors = [
  "#eff6ff",
  "#ecfdf5",
  "#fffbeb",
  "#fdf2f8",
  "#f5f3ff",
  "#f0fdfa",
  "#fff7ed",
];

export default function TodoList({
  todos,
  deleteTodo,
  editTodo,
  handleToggleTodo,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="list-container">
        {[...Array(6)].map((_, index) => (
          <div className="list-item skeleton-item" key={index}>
            <div className="card-top">
              <div className="card-text">
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-desc"></div>
              </div>
            </div>
            <div className="card-bottom">
              <div className="skeleton skeleton-tag"></div>
              <div className="card-actions">
                <div className="skeleton skeleton-btn"></div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="list-container">
      {todos.length > 0 ? (
        todos.map((todo) => {
          const bgColor = lightColors[todo.id % lightColors.length];
          return (
            <div
              className="list-item"
              key={todo.id}
              style={{ backgroundColor: bgColor }}
            >
              <div className="card-top">
                <div className="card-text">
                  <p
                    className={`card-title ${todo.completed ? "completed" : ""}`}
                  >
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="card-desc">{todo.description}</p>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
              </div>

              <div className="card-bottom">
                <div className="card-meta">
                  <span
                    className={`todo-status ${todo.completed ? "is-completed" : "is-pending"}`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                  {todo.time && (
                    <span className="todo-time">
                      <FiClock />{" "}
                      {new Date(todo.time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => editTodo(todo)}
                    disabled={todo.completed}
                    data-tooltip="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                    data-tooltip="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="fallback-value">No todo has been added yet</p>
      )}
    </div>
  );
}
