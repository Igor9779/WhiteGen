import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "./ApiKeys.css";

import {
  setClickupToken,
  setTelegramChatId,
  checkClickupToken,
  checkTelegramChatId,
} from "../api/settingsApi";

export default function ApiKeysPage() {
  const [clickupToken, setClickupTokenValue] = useState("");
  const [chatId, setChatId] = useState("");

  // 🔹 Отримуємо статуси напряму з бекенду
  const {
    data: clickupData,
    isLoading: isTokenLoading,
    isError: isTokenError,
  } = useQuery({
    queryKey: ["clickup-token"],
    queryFn: checkClickupToken,
    refetchOnMount: true,
    staleTime: 0,
  });

  const {
    data: telegramData,
    isLoading: isTelegramLoading,
    isError: isTelegramError,
  } = useQuery({
    queryKey: ["telegram-id"],
    queryFn: checkTelegramChatId,
    refetchOnMount: true,
    staleTime: 0,
  });

  // 🔹 Мутації
  const clickupMutation = useMutation({
    mutationFn: (token) => setClickupToken(token),
    onSuccess: () => {
      toast.success("✅ ClickUp токен успішно збережено!");
      setClickupTokenValue("");
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
      setChatId("");
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

  // 🔸 Відображення
  return (
    <div className="api-page-wrapper">
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
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder={
                  telegramData?.exists
                    ? "*********"
                    : "Введіть свій Telegram Chat ID"
                }
                required
              />
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
          ) : isTelegramError ? (
            <p className="text-danger">❌ Помилка перевірки Chat ID</p>
          ) : telegramData?.exists ? (
            <p className="text-success">✅ Telegram Chat ID збережено</p>
          ) : (
            <p className="text-warning">⚠️ Chat ID ще не задано</p>
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
                type="text"
                value={clickupToken}
                onChange={(e) => setClickupTokenValue(e.target.value)}
                placeholder={
                  clickupData?.exists
                    ? "*********"
                    : "Введіть свій ClickUp токен"
                }
                required
              />
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
          ) : isTokenError ? (
            <p className="text-danger">❌ Помилка перевірки токена</p>
          ) : clickupData?.exists ? (
            <p className="text-success">✅ ClickUp токен активний</p>
          ) : (
            <p className="text-warning">⚠️ Токен ще не заданий</p>
          )}
        </form>
      </section>
    </div>
  );
}
