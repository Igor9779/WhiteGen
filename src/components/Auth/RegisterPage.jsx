import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthPage.css";
import { registerUser } from "../../api/userApi";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const navigate = useNavigate();

  // 🔹 Мутація реєстрації користувача
  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      toast.success("✅ Реєстрація успішна! Код відправлено адміністратору.");
      console.log("Registered user:", data);
      navigate("/confirm", { state: { email } });
    },

    onError: (err) => {
      const msg =
        err.response?.data?.message || err.message || "Помилка при реєстрації";
      setError(msg);
      toast.error(`❌ ${msg}`);
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();

    // 🚫 Тимчасово вимкнено валідацію для тесту API
    /*
    if (!email.includes("@9d.pro")) {
      setError("Некоректний email! Використовуйте пошту *@9d.pro");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== repeatPassword) {
      setError("Паролі не збігаються");
      return;
    }
    */

    setError("");
    registerMutation.mutate({ email, password });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Реєстрація</h2>

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

        <div className="form-group password-wrapper">
          <label>Повторіть пароль</label>
          <div className="password-field">
            <input
              type={showRepeat ? "text" : "password"}
              placeholder="Повторіть пароль"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowRepeat(!showRepeat)}
            >
              <i className={`bi ${showRepeat ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {registerMutation.isPending && (
          <p className="loading">⏳ Відправка...</p>
        )}
        {registerMutation.isSuccess && (
          <p className="success">✅ Реєстрація успішна</p>
        )}

        <div className="button-group">
          <button
            type="submit"
            className="btn login-btn"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Відправка..." : "Підтвердити"}
          </button>
          <button
            type="button"
            className="btn forgot-btn"
            onClick={() => navigate("/")}
          >
            Назад до входу
          </button>
        </div>
      </form>
    </div>
  );
}
