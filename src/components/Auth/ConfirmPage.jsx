import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthPage.css";
import { confirmUser, checkAuth } from "../../api/userApi";

export default function ConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 якщо сторінку відкрили без email — одразу редірект
  useEffect(() => {
    if (!location.state?.email) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // 🧩 Мутація для підтвердження 2FA-коду
  const confirmMutation = useMutation({
    mutationFn: confirmUser,

    onSuccess: async (data) => {
      toast.success("✅ Код підтверджено! Акаунт активовано.");
      console.log("Confirmed user:", data);

      // 🕓 невелика пауза — Render іноді виставляє cookie із затримкою
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const auth = await checkAuth();
        if (auth?.authenticated) {
          navigate("/generator", { replace: true });
        } else {
          toast.warn("⚠️ Сесія ще не оновилась. Будь ласка, увійдіть знову.");
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/", { replace: true });
      }
    },

    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "❌ Помилка підтвердження коду";
      setError(msg);
      toast.error(msg);
    },
  });

  const handleConfirm = (e) => {
    e.preventDefault();
    setError("");
    confirmMutation.mutate({ email, code });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleConfirm}>
        <h2>Підтвердження акаунта</h2>

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

        <div className="form-group">
          <label>Код підтвердження</label>
          <input
            type="text"
            placeholder="Введіть код"
            value={code}
            maxLength="6"
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {confirmMutation.isPending && (
          <p className="loading">⏳ Підтвердження...</p>
        )}
        {confirmMutation.isSuccess && (
          <p className="success">✅ Код успішно підтверджено</p>
        )}

        <div className="button-group">
          <button
            type="submit"
            className="btn login-btn"
            disabled={confirmMutation.isPending}
          >
            {confirmMutation.isPending ? "Відправка..." : "Підтвердити"}
          </button>
          <button
            type="button"
            className="btn forgot-btn"
            onClick={() => navigate("/")}
          >
            Назад
          </button>
        </div>
      </form>
    </div>
  );
}
