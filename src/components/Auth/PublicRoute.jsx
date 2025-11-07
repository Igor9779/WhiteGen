import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "../../api/userApi";
import { Navigate } from "react-router-dom";

/**
 * PublicRoute — блокує доступ до сторінок (login, register, confirm, reset-password)
 * для користувачів, які вже авторизовані (мають активну сесію на бекенді).
 */
export default function PublicRoute({ children }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-check-public"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 0,
  });

  if (isLoading) {
    return <p className="text-center mt-10">⏳ Перевірка доступу...</p>;
  }

  // ✅ якщо користувач уже авторизований → редіректимо в генератор
  if (!isError && data?.success) {
    return <Navigate to="/generator" replace />;
  }

  // 🔓 інакше показуємо сторінку (login, register тощо)
  return children;
}
