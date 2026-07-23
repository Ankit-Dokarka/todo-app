import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import LoginPage from "../components/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
