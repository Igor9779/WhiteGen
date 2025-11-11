import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "./AuthPage.css";
import { setNewPassword } from "../../api/userApi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams(); // ⚡ Отримуємо токен із URL

  // 🔹 Мутація — надсилання нового пароля разом із токеном
  const resetMutation = useMutation({
    mutationFn: setNewPassword,
    onSuccess: () => {
      toast.success("✅ Пароль успішно змінено!");
      navigate("/", { replace: true }); // перенаправляємо на сторінку входу
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

    if (password !== confirmPassword) {
      toast.warning("⚠️ Паролі не співпадають!");
      return;
    }

    resetMutation.mutate({ token, password });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Встановлення нового пароля</h2>

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
