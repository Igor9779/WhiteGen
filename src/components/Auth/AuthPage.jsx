import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "./AuthPage.css";
import { loginUser } from "../../api/userApi";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  // 🔹 Мутація логіну
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("✅ Логін успішний! Код 2FA відправлено адміністратору.");
      console.log("Login response:", data);
      navigate("/confirm", { state: { email }, replace: true });
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || err.message || "❌ Помилка входу";
      toast.error(msg);
    },
  });

  // 🔹 Мутація "Забули пароль" (тимчасово фейкова — можна буде підключити бекенд)
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      // 🔸 Тут буде реальний запит, наприклад:
      // const res = await api.post("/auth/forgot-password", { email });
      // return res.data;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { message: "Код для відновлення пароля відправлено на email." };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setShowForgotForm(false);
      setForgotEmail("");
    },
    onError: () => {
      toast.error("❌ Не вдалося надіслати email для відновлення");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (!password) {
      setError("Введіть пароль");
      return;
    }

    setError("");
    loginMutation.mutate({ email, password });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.warning("⚠️ Введіть email для відновлення");
      return;
    }
    forgotPasswordMutation.mutate(forgotEmail);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Авторизація</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="example@9d.pro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group password-wrapper">
          <label>Пароль</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введіть пароль"
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

        {error && <p className="error">{error}</p>}

        <div className="button-group">
          <button
            type="submit"
            className="btn login-btn"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Вхід..." : "Ввійти"}
          </button>
          <button
            type="button"
            className="btn register-btn"
            onClick={() => navigate("/register")}
          >
            Зареєструватись
          </button>

          {/* 🔹 Нова кнопка "Забули пароль?" */}
          <button
            type="button"
            className="btn forgot-btn"
            onClick={() => setShowForgotForm(true)}
          >
            Забули пароль?
          </button>
        </div>
      </form>

      {/* 🔸 Модалка "Забули пароль" */}
      {showForgotForm && (
        <div className="forgot-modal-overlay">
          <div className="forgot-modal">
            <h3 className="forgot-modal-title">🔑 Відновлення пароля</h3>

            <form className="forgot-modal-form" onSubmit={handleForgotSubmit}>
              <label className="forgot-modal-label">Введіть свій email:</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="forgot-modal-input"
                placeholder="example@9d.pro"
                required
              />

              <div className="forgot-modal-buttons">
                <button
                  type="submit"
                  className="btn forgot-modal-send-btn"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending
                    ? "⏳ Надсилання..."
                    : "Надіслати код"}
                </button>
                <button
                  type="button"
                  className="btn forgot-modal-close-btn"
                  onClick={() => setShowForgotForm(false)}
                >
                  Закрити
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
