import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "./ApiKeys.css";
import GeneratorHeader from "../components/GeneratorHeader";
import {
  setClickupToken,
  setTelegramChatId,
  checkClickupToken,
  checkTelegramChatId,
} from "../api/settingsApi";

export default function ApiKeysPage() {
  const [clickupToken, setClickupTokenValue] = useState("");
  const [chatId, setChatId] = useState("");
  const [showClickup, setShowClickup] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [tokenExists, setTokenExists] = useState(false);
  const [chatExists, setChatExists] = useState(false);

  // 🔹 Перевірка стану з бекенду (при першому завантаженні)
  const { isLoading: isTokenLoading } = useQuery({
    queryKey: ["clickup-token"],
    queryFn: checkClickupToken,
    onSuccess: (data) => {
      setTokenExists(data?.exists || false);
    },
    onError: () => toast.error("❌ Не вдалося перевірити ClickUp токен"),
  });

  const { isLoading: isTelegramLoading } = useQuery({
    queryKey: ["telegram-id"],
    queryFn: checkTelegramChatId,
    onSuccess: (data) => {
      setChatExists(data?.exists || false);
    },
    onError: () => toast.error("❌ Не вдалося перевірити Telegram Chat ID"),
  });

  // 🔹 Мутації — без refetch, просто оновлюємо локальний стан
  const clickupMutation = useMutation({
    mutationFn: (token) => setClickupToken(token),
    onSuccess: () => {
      toast.success("✅ ClickUp токен успішно збережено!");
      setTokenExists(true); // оновлюємо локально
      setClickupTokenValue(""); // очищаємо поле
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message ||
          "❌ Помилка при збереженні ClickUp токена"
      ),
  });

  const telegramMutation = useMutation({
    mutationFn: (id) => setTelegramChatId(id),
    onSuccess: () => {
      toast.success("✅ Telegram Chat ID успішно збережено!");
      setChatExists(true); // оновлюємо локально
      setChatId(""); // очищаємо поле
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message ||
          "❌ Помилка при збереженні Telegram Chat ID"
      ),
  });

  // 🔸 Обробники
  const handleClickupSubmit = (e) => {
    e.preventDefault();
    if (!clickupToken.trim()) {
      toast.warning("⚠️ Введіть ClickUp токен!");
      return;
    }
    clickupMutation.mutate(clickupToken);
  };

  const handleTelegramSubmit = (e) => {
    e.preventDefault();
    if (!chatId.trim()) {
      toast.warning("⚠️ Введіть Telegram Chat ID!");
      return;
    }
    telegramMutation.mutate(chatId);
  };

  return (
    <div className="api-page-wrapper">
      <GeneratorHeader />

      <section className="api-page">
        <h2>Керування API Ключами</h2>

        {/* 🔹 Telegram */}
        <form onSubmit={handleTelegramSubmit} className="api-form">
          <div className="api-subform">
            <h3>🔹 Telegram (Статуси)</h3>
            <label htmlFor="chatId">Chat ID:</label>
            <div className="password-field">
              <input
                id="chatId"
                type={showTelegram ? "text" : "password"}
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder={
                  chatExists ? "*********" : "Введіть свій Telegram Chat ID"
                }
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowTelegram((prev) => !prev)}
              >
                {showTelegram ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn api-btn"
            disabled={telegramMutation.isPending}
          >
            {telegramMutation.isPending
              ? "⏳ Надсилання..."
              : "Відправити Chat ID"}
          </button>

          {isTelegramLoading ? (
            <p>⏳ Перевірка Chat ID...</p>
          ) : (
            <p className={chatExists ? "text-success" : "text-warning"}>
              {chatExists
                ? "✅ Telegram Chat ID збережено"
                : "⚠️ Chat ID ще не задано"}
            </p>
          )}
        </form>

        {/* 🔹 ClickUp */}
        <form onSubmit={handleClickupSubmit} className="api-form">
          <div className="api-subform">
            <h3>🔹 ClickUp API Token</h3>
            <label htmlFor="clickupToken">Token:</label>
            <div className="password-field">
              <input
                id="clickupToken"
                type={showClickup ? "text" : "password"}
                value={clickupToken}
                onChange={(e) => setClickupTokenValue(e.target.value)}
                placeholder={
                  tokenExists ? "*********" : "Введіть свій ClickUp токен"
                }
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowClickup((prev) => !prev)}
              >
                {showClickup ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn api-btn"
            disabled={clickupMutation.isPending}
          >
            {clickupMutation.isPending
              ? "⏳ Надсилання..."
              : "Відправити ClickUp токен"}
          </button>

          {isTokenLoading ? (
            <p>⏳ Перевірка токена...</p>
          ) : (
            <p className={tokenExists ? "text-success" : "text-warning"}>
              {tokenExists
                ? "✅ ClickUp токен активний"
                : "⚠️ Токен ще не заданий"}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
