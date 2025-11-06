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
  const navigate = useNavigate();

  // 🔹 Мутація логіну
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("✅ Логін успішний! Код 2FA відправлено адміністратору.");
      console.log("Login response:", data);
      navigate("/confirm", { state: { email } }); // користувач переходить на сторінку для введення коду
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || err.message || "❌ Помилка входу";
      toast.error(msg);
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

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Авторизація</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
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
        </div>
      </form>
    </div>
  );
}
