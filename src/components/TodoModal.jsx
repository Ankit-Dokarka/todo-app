import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import "./TodoModal.css";

export default function TodoModal({ isOpen, onClose, onSave, editingTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editingTodo) {
        setTitle(editingTodo.title || "");
        setDescription(editingTodo.description || "");
        setTime(editingTodo.time || "");
      } else {
        setTitle("");
        setDescription("");
        setTime("");
      }
    }
  }, [isOpen, editingTodo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, time });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content todo-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <FiX />
        </button>
        <h2 className="modal-title">
          {editingTodo ? "Edit Task" : "Add New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Completion Time</label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-confirm">
              {editingTodo ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
