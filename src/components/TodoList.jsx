import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./TodoList.css";

export default function TodoList({
  todos,
  deleteTodo,
  editTodo,
  handleToggleTodo,
}) {
  return (
    <div className="list-container">
      {todos.length > 0 ? (
        todos.map((todo) => {
          return (
            <div className="list-item" key={todo.id}>
              <div className="left-side">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                <p className={todo.completed ? "completed" : ""}>
                  {todo.todoName}
                </p>
              </div>

              <div className="right-side">
                <button
                  className="icon-btn edit-btn"
                  onClick={() => editTodo(todo.id)}
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
          );
        })
      ) : (
        <p className="fallback-value">No todo has been added yet</p>
      )}
    </div>
  );
}
