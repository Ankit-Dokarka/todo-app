import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
