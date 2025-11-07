import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthPage.css";
import { confirmUser, checkAuth } from "../../api/userApi"; // ✅ додано checkAuth

export default function ConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

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

      // 🕓 чекаємо, поки бекенд виставить cookie — робимо 3 спроби
      let authenticated = false;

      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // пауза 1 секунда
        const authCheck = await checkAuth();
        if (authCheck?.authenticated) {
          authenticated = true;
          break;
        }
      }

      if (authenticated) {
        navigate("/generator", { replace: true });
      } else {
        toast.warn("⚠️ Сесія ще не оновилась. Увійдіть знову.");
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
        {confirmMutation.isPending && <p>⏳ Підтвердження...</p>}

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
