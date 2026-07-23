import { FiCheckSquare, FiLogOut, FiTrash2 } from "react-icons/fi";
import "./Header.css";

export default function Header({
  handleDeleteCompletedClick,
  handleDeleteAllClick,
  handleLogout,
}) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <FiCheckSquare size={24} />
        <h1>Todo Manager</h1>
      </div>

      <div className="header-actions">
        <button
          className="header-action-btn"
          onClick={handleDeleteCompletedClick}
        >
          Delete completed
        </button>
        <button className="header-action-btn" onClick={handleDeleteAllClick}>
          <FiTrash2 /> Delete all
        </button>

        <button className="header-action-btn logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
}
