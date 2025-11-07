import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "../../api/userApi";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auth-check"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 0,
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "⚠️ Сесія недійсна. Увійдіть знову.";
      toast.warn(msg);
    },
  });

  // 🔄 Поки чекаємо перевірку
  if (isLoading) {
    return <p className="text-center mt-10">⏳ Перевірка авторизації...</p>;
  }

  // 🚫 Якщо помилка — редірект на /
  if (isError || !data?.authenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Якщо користувач авторизований — відображаємо контент сторінки
  return children;
}
