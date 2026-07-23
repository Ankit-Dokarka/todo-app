import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Header handleLogout={handleLogout} />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
