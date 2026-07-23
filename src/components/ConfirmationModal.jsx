import { FiAlertTriangle, FiX } from "react-icons/fi";
import "./ConfirmationModal.css";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-icon">
          <FiAlertTriangle />
        </div>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
