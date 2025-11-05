import React, { useState } from "react";
import "./ApiKeys.css";
import GeneratorHeader from "../components/GeneratorHeader";

export default function ApiKeysPage() {
  const [telegramChatId, setTelegramChatId] = useState("");
  const [clickupToken, setClickupToken] = useState("");
  const [status, setStatus] = useState("");

  const handleTelegramSubmit = (e) => {
    e.preventDefault();
    // тут логіка відправки на бекенд / API
    setStatus("✅ Chat ID успішно надіслано до Telegram!");
    setTimeout(() => setStatus(""), 3000);
  };

  const handleClickupSubmit = (e) => {
    e.preventDefault();
    // тут логіка відправки токена
    setStatus("✅ ClickUp токен успішно надіслано!");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="api-page-wrapper">
      {/* ===== HEADER ===== */}
      <GeneratorHeader />

      {/* ===== MAIN CONTENT ===== */}
      <section className="api-page">
        <h2>Керування API Ключами</h2>

        <form
          className="api-form full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!telegramChatId || !clickupToken) {
              setStatus("⚠️ Будь ласка, заповніть усі поля!");
              return;
            }

            // приклад відправки даних
            const payload = {
              telegramChatId,
              clickupToken,
            };
            console.log("Відправка даних:", payload);
            setStatus("✅ Дані успішно надіслані!");
            setTimeout(() => setStatus(""), 3000);
          }}
        >
          <div className="forms-wrapper single">
            <div className="api-subform">
              <h3>🔹 Telegram (Статуси)</h3>
              <label htmlFor="telegramChatId">Chat ID:</label>
              <input
                id="telegramChatId"
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Вставте свій Chat ID"
                required
              />
            </div>

            <div className="api-subform">
              <h3>🔹 ClickUp (Коментарі)</h3>
              <label htmlFor="clickupToken">ClickUp API Token:</label>
              <input
                id="clickupToken"
                type="text"
                value={clickupToken}
                onChange={(e) => setClickupToken(e.target.value)}
                placeholder="Вставте свій токен"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn api-btn">
            Відправити Дані
          </button>
        </form>

        {status && <div className="status-message">{status}</div>}
      </section>
    </div>
  );
}
