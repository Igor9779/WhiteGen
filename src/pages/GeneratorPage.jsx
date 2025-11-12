import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "./GeneratorPage.css";

import {
  downloadArchive,
  generateLanding,
  getAllArchives,
} from "../api/filesApi";
import { checkClickupToken, checkTelegramChatId } from "../api/settingsApi";
import { useNavigate } from "react-router-dom";

export default function GeneratorPage() {
  const [status, setStatus] = useState("⏳ Очікування запуску...");
  const [isDownloading, setIsDownloading] = useState(false);
  const [themesText, setThemesText] = useState("");
  const [showMissingTokensModal, setShowMissingTokensModal] = useState(false);
  const [missingReason, setMissingReason] = useState(""); // 🔹 динамічний текст
  const navigate = useNavigate();

  // 🔹 Завантаження архівів при відкритті сторінки
  const {
    data: archives = [],
    isLoading: isArchivesLoading,
    isError: isArchivesError,
    refetch: refetchArchives,
  } = useQuery({
    queryKey: ["archives"],
    queryFn: getAllArchives,
    onError: () => toast.error("❌ Не вдалося отримати архіви користувача"),
  });

  // 🔹 Мутація для запуску генерації лендингів
  const mutation = useMutation({
    mutationFn: generateLanding,
    onSuccess: async () => {
      toast.success("✅ Генерація успішно запущена!");
      setStatus("✅ Генерація завершена, оновлюємо список архівів...");
      await refetchArchives();
      setStatus("✅ Генерація завершена, можна завантажити архів");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "🚨 Помилка при генерації";
      toast.error(msg);
      setStatus("❌ Помилка при генерації");
    },
  });

  // 🔹 Перевірка токенів при завантаженні сторінки
  const { data: clickupStatus } = useQuery({
    queryKey: ["clickup-token"],
    queryFn: checkClickupToken,
  });

  const { data: telegramStatus } = useQuery({
    queryKey: ["telegram-id"],
    queryFn: checkTelegramChatId,
  });

  // 🔸 Обробка форми
  const handleGenerate = async (e) => {
    e.preventDefault();
    setStatus("⏳ Перевірка токенів перед генерацією...");

    const form = e.target;
    const isClickupChecked =
      form.clickupfile.checked || form.sentclickupfile.checked;

    const hasTelegram = telegramStatus?.exists === true;
    const hasClickup =
      clickupStatus?.exists === true && clickupStatus?.active !== false;

    // 🧩 Telegram Chat ID — обов’язковий завжди
    if (!hasTelegram) {
      setMissingReason(
        "Відсутній Telegram Chat ID. Його потрібно додати, щоб отримувати статуси генерації."
      );
      setShowMissingTokensModal(true);
      setStatus("⚠️ Необхідно додати Telegram Chat ID перед генерацією");
      return;
    }

    // 🧩 Якщо увімкнено ClickUp, але токен відсутній
    if (isClickupChecked && !hasClickup) {
      setMissingReason(
        "Ви вибрали опції ClickUp, але токен ClickUp відсутній. Будь ласка, додайте його перед запуском генерації."
      );
      setShowMissingTokensModal(true);
      setStatus("⚠️ Необхідно додати ClickUp токен перед генерацією");
      return;
    }

    // ✅ Якщо все гаразд
    setStatus("⏳ Генерація запущена...");

    let parsed;
    try {
      parsed = JSON.parse(themesText);
    } catch {
      toast.error("❌ Некоректний JSON у полі 'Теми сайтів'");
      return;
    }

    if (!Array.isArray(parsed)) {
      toast.error("❌ JSON має бути масивом об’єктів");
      return;
    }

    const isValid = parsed.every(
      (item) =>
        typeof item === "object" &&
        "domain" in item &&
        "name_theme" in item &&
        "brand_name" in item
    );

    if (!isValid) {
      toast.error(
        "❌ Кожен об’єкт має містити поля: domain, name_theme, brand_name"
      );
      return;
    }

    const payload = {
      clickup: form.clickupfile.checked,
      senClickupFile: form.sentclickupfile?.checked || false,
      tw: form.twbs.value === "Tailwind",
      task: form.commandnumber.value,
      lang: form.language.value,
      team: form.tasknumber.value,
      task_id: form.taskid.value,
      geo: form.geo.value,
      themes: parsed,
    };

    mutation.mutate(payload);
  };

  // 🔹 Завантаження архіву
  const handleDownload = async (whiteId) => {
    setIsDownloading(true);
    try {
      await downloadArchive(whiteId);
    } catch (err) {
      toast.error("❌ Не вдалося завантажити архів");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="generator-container">
      <main className="generator-grid">
        {/* 🔹 Ліва колонка */}
        <section className="column column-left">
          <h3>Параметри</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>
                <input id="clickupfile" name="clickupfile" type="checkbox" />{" "}
                Clickup
              </label>
              <label>
                <input
                  id="sentclickupfile"
                  name="sentclickupfile"
                  type="checkbox"
                />{" "}
                Sent Clickup File
              </label>
            </div>

            <div className="form-group">
              <label>Tailwind / Bootstrap</label>
              <select name="twbs" required>
                <option value="">-- оберіть --</option>
                <option>Bootstrap</option>
                <option>Tailwind</option>
              </select>
            </div>

            <div className="form-group">
              <label>Command Number:</label>
              <input name="commandnumber" type="text" required />
            </div>

            <div className="form-group">
              <label>Task Number:</label>
              <input name="tasknumber" type="text" required />
            </div>

            <div className="form-group">
              <label>Task ID:</label>
              <input name="taskid" type="text" required />
            </div>

            <div className="form-group">
              <label>Language</label>
              <select name="language" required>
                <option value="">-- оберіть мову --</option>
                <option>en</option>
                <option>de</option>
                <option>fr</option>
                <option>ja</option>
                <option>hr</option>
                <option>sl</option>
              </select>
            </div>

            <div className="form-group">
              <label>Geo:</label>
              <input name="geo" type="text" placeholder="CH" required />
            </div>

            <button
              type="submit"
              className="btn generate-btn"
              disabled={mutation.isPending || isDownloading}
            >
              {mutation.isPending
                ? "⚙️ Генерація..."
                : isDownloading
                ? "📦 Завантаження..."
                : "▶️ Генерувати"}
            </button>
          </form>

          <p className="status-text">{status}</p>
        </section>

        {/* 🔸 Центр */}
        <section className="column column-center">
          <h3>Теми сайтів (JSON формат)</h3>
          <p className="hint">Вставте масив об’єктів у форматі:</p>
          <textarea
            rows="18"
            value={themesText}
            placeholder="[ { domain: 'example.com', name_theme: 'Theme Name', brand_name: 'Brand' }, .... ]"
            onChange={(e) => setThemesText(e.target.value)}
          />
        </section>

        {/* 🔹 Праворуч — історія архівів */}
        <section className="column column-right">
          <h3>Сгенеровані архіви</h3>

          {isArchivesLoading && <p>⏳ Завантаження архівів...</p>}
          {isArchivesError && <p>❌ Помилка при отриманні архівів</p>}

          {archives.length > 0 ? (
            <ul>
              {archives.map((archive, index) => (
                <li key={index} className="archive-item">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(archive.name)}
                    disabled={isDownloading}
                  >
                    📦 Завантажити {archive.name}.zip
                  </button>
                  <p className="archive-meta">
                    🕒 {new Date(archive.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !isArchivesLoading && <p>Архівів ще немає</p>
          )}
        </section>
      </main>

      {/* 🔸 Модалка при відсутності токенів */}
      {showMissingTokensModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Відсутні необхідні токени</h3>
            <p>{missingReason}</p>
            <div className="modal-buttons">
              <button
                className="btn"
                onClick={() => setShowMissingTokensModal(false)}
              >
                Закрити
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/apikeys")}
              >
                Відкрити налаштування API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
