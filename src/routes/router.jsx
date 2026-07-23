import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../components/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
