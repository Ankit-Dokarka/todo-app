import { useNavigate } from "react-router-dom";
import { FiHome, FiAlertOctagon } from "react-icons/fi";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="nf-shape shape-1"></div>
      <div className="nf-shape shape-2"></div>
      <div className="nf-shape shape-3"></div>

      <div className="nf-content">
        <div className="nf-icon">
          <FiAlertOctagon />
        </div>

        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Page Not Found</h2>
        <p className="nf-text">
          Looks like this page wasn't on your todo list. The page you are
          looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        <button className="nf-btn" onClick={() => navigate("/")}>
          <FiHome /> Back to Home
        </button>
      </div>
    </div>
  );
}
