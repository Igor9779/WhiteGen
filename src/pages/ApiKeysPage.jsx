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

  // 🔹 Перевірки з бекенду
  const { data: tokenStatus, isLoading: isTokenLoading } = useQuery({
    queryKey: ["clickup-token"],
    queryFn: checkClickupToken,
    onError: () => toast.error("❌ Не вдалося перевірити ClickUp токен"),
  });

  const { data: telegramStatus, isLoading: isTelegramLoading } = useQuery({
    queryKey: ["telegram-id"],
    queryFn: checkTelegramChatId,
    onError: () => toast.error("❌ Не вдалося перевірити Telegram Chat ID"),
  });

  // 🔹 Мутації
  const clickupMutation = useMutation({
    mutationFn: setClickupToken,
    onSuccess: () => toast.success("✅ ClickUp токен успішно збережено!"),
    onError: (err) =>
      toast.error(
        err.response?.data?.message ||
          "❌ Помилка при збереженні ClickUp токена"
      ),
  });

  const telegramMutation = useMutation({
    mutationFn: setTelegramChatId,
    onSuccess: () => toast.success("✅ Telegram Chat ID успішно збережено!"),
    onError: (err) =>
      toast.error(
        err.response?.data?.message ||
          "❌ Помилка при збереженні Telegram Chat ID"
      ),
  });

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
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder={
                  telegramStatus.exists
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

          {/* 🔸 Статус Telegram */}
          {isTelegramLoading ? (
            <p>⏳ Перевірка Chat ID...</p>
          ) : telegramStatus ? (
            <p
              className={
                telegramStatus.exists ? "text-success" : "text-warning"
              }
            >
              {telegramStatus.message ||
                (telegramStatus.exists
                  ? "✅ Telegram Chat ID збережено"
                  : "⚠️ Chat ID ще не задано")}
            </p>
          ) : (
            <p>❌ Даних про Chat ID немає</p>
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
                  tokenStatus.exists
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

          {/* 🔸 Статус ClickUp токена */}
          {isTokenLoading ? (
            <p>⏳ Перевірка токена...</p>
          ) : tokenStatus ? (
            <p className={tokenStatus.exists ? "text-success" : "text-warning"}>
              {tokenStatus.message ||
                (tokenStatus.exists
                  ? "✅ ClickUp токен активний"
                  : "⚠️ Токен неактивний")}
            </p>
          ) : (
            <p>❌ Даних про токен немає</p>
          )}
        </form>
      </section>
    </div>
  );
}
