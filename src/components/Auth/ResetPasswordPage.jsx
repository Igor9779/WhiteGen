import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./AuthPage.css";
import { resetPassword } from "../../api/userApi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 якщо користувач потрапив сюди без дозволу — редірект на /
  if (!location.state?.allowReset) {
    navigate("/");
    return null;
  }
  // 🔹 Мутація — запит на оновлення пароля
  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("✅ Пароль успішно змінено!");
      navigate("/"); // перенаправляємо на сторінку входу
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "❌ Не вдалося змінити пароль";
      toast.error(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMutation.mutate({ password, confirmPassword });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Відновлення пароля</h2>

        <div className="form-group password-wrapper">
          <label>Новий пароль</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введіть новий пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </button>
          </div>
        </div>

        <div className="form-group password-wrapper">
          <label>Підтвердіть пароль</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Повторіть пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                }`}
              ></i>
            </button>
          </div>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="btn login-btn"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? "⏳ Збереження..." : "Змінити пароль"}
          </button>
          <button
            type="button"
            className="btn register-btn"
            onClick={() => navigate("/")}
          >
            Назад до входу
          </button>
        </div>
      </form>
    </div>
  );
}
