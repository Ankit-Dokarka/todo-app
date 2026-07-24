import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import "./TodoModal.css";

export default function TodoModal({ isOpen, onClose, onSave, editingTodo }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      time: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingTodo) {
        reset({
          title: editingTodo.title || "",
          description: editingTodo.description || "",
          time: editingTodo.time || "",
        });
      } else {
        reset({
          title: "",
          description: "",
          time: "",
        });
      }
    }
  }, [isOpen, editingTodo, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
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
          {editingTodo ? "Edit Todo" : "Add New Todo"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="todo-form"
          noValidate
        >
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className={errors.title ? "input-error" : ""}
              placeholder="Todo title"
              {...register("title", { required: "Title is required" })}
              autoFocus
            />
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className={errors.description ? "input-error" : ""}
              placeholder="Add details about this todo..."
              rows="4"
              {...register("description")}
            />
          </div>

          <div className="form-group">
            <label>Completion Time</label>
            <input
              type="datetime-local"
              className={errors.time ? "input-error" : ""}
              {...register("time", { required: "Completion time is required" })}
            />
            {errors.time && (
              <p className="error-message">{errors.time.message}</p>
            )}
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
              {editingTodo ? "Update Todo" : "Add Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
