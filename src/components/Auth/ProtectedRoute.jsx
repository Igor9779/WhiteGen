// src/components/Auth/ProtectedRoute.jsx
import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "../../api/userApi";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-check"],
    queryFn: checkAuth,
    retry: false, // не повторюємо запит, якщо токен недійсний
  });

  if (isLoading) {
    return <p className="text-center mt-10">⏳ Перевірка авторизації...</p>;
  }

  if (isError) {
    toast.warn("⚠️ Сесія недійсна. Увійдіть знову.");
    return <Navigate to="/" replace />;
  }

  // Якщо користувач авторизований — відображаємо контент сторінки
  return children;
}
