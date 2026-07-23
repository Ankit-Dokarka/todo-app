import { useState, useEffect, useRef } from "react";
import { FiCheckSquare, FiUser, FiLogOut, FiBell } from "react-icons/fi";
import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function Header({ handleLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const currentUserEmail = localStorage.getItem("currentUser") || "User";
  const firstLetter = currentUserEmail.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-brand" onClick={() => navigate("/")}>
        <FiCheckSquare size={24} />
        <h1>Todo Manager</h1>
      </div>

      <div className="header-actions">
        <button className="header-icon-btn" aria-label="Notifications">
          <FiBell size={18} />
        </button>

        <div className="user-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="user-avatar-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="User menu"
          >
            {firstLetter}
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <span className="dropdown-label">Signed in as</span>
                <strong className="dropdown-email">{currentUserEmail}</strong>
              </div>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                <FiUser /> My Profile
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout-item"
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
