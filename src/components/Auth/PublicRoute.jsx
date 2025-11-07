import { Navigate } from "react-router-dom";

/**
 * PublicRoute — захищає публічні сторінки (login, register, confirm)
 * від доступу вже авторизованих користувачів.
 */
export default function PublicRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // або sessionStorage

  return isAuthenticated ? <Navigate to="/generator" replace /> : children;
}
