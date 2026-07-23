import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import LoginPage from "../components/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

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
    path: "/login",
    element: <LoginPage />,
  },
]);
