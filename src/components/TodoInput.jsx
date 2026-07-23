import "./TodoInput.css";
import { FiPlus, FiEdit2 } from "react-icons/fi";

export default function TodoInput({
  addTodo,
  inputValue,
  setInputValue,
  editId,
}) {
  return (
    <div className="todo-input-container">
      <input
        type="text"
        placeholder="Add a new todo..."
        className="todo-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="add-todo-btn"
        onClick={addTodo}
        disabled={!inputValue.trim()}
      >
        {editId ? <FiEdit2 /> : <FiPlus />}
        {editId ? <p>Update</p> : <p>Add Todo</p>}
      </button>
    </div>
  );
}
