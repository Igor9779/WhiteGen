import { useState } from "react";
import "./GeneratorPage.css";
import GeneratorHeader from "../components/GeneratorHeader";

export default function GeneratorPage() {
  const [status, setStatus] = useState("⏳ Очікування запуску...");
  const [archives, setArchives] = useState([]);
  const [themesText, setThemesText] = useState(`[
  {
    "domain": "WhiteGen.com",
    "name_theme": "Основна тема сайту",
    "brand_name": "WhiteGen"
  },
  {
    "domain": "AIpowerGen.com",
    "name_theme": "AI генератор сайтів",
    "brand_name": "AIpowerGen"
  }
]`);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setStatus("⏳ Генерація запущена...");
    const form = e.target;

    const formData = {
      clickupfile: form.clickupfile.checked,
      twbs: form.twbs.value,
      commandnumber: form.commandnumber.value,
      tasknumber: form.tasknumber.value,
      taskid: form.taskid.value,
      language: form.language.value,
      geo: form.geo.value,
      json: [],
    };

    // 🔹 Перевіряємо JSON
    let parsed;
    try {
      parsed = JSON.parse(themesText);
    } catch {
      setStatus("❌ Некоректний JSON у полі 'Теми сайтів'");
      return;
    }

    if (!Array.isArray(parsed)) {
      setStatus("❌ JSON має бути масивом об’єктів");
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
      setStatus(
        "❌ Кожен об’єкт має містити поля: domain, name_theme, brand_name"
      );
      return;
    }

    formData.json = parsed;

    // 🔹 Імітація бекенду: створення одного архіву tasknumber.zip
    setStatus("⚙️ Генерація сайтів...");
    setTimeout(() => {
      const taskZip = `${formData.tasknumber}.zip`;

      // імітуємо структуру файлів усередині архіву
      const internalFiles = parsed.map(
        (item) => `${item.domain}_${formData.tasknumber}`
      );

      console.log("🧩 Вміст архіву:", internalFiles);

      setArchives((prev) => [...prev, { name: taskZip, sites: internalFiles }]);
      setStatus(`✅ Створено архів ${taskZip} із ${parsed.length} сайт(ами)`);
    }, 1500);

    // 🔹 У майбутньому тут буде реальний бекенд:
    /*
    const res = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    */
  };

  return (
    <div className="generator-container">
      <GeneratorHeader />

      <main className="generator-grid">
        {/* 🔹 Ліва колонка */}
        <section className="column column-left">
          <h3>Параметри</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>
                <input id="clickupfile" name="clickupfile" type="checkbox" />{" "}
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

            <button type="submit" className="btn generate-btn">
              ▶️ Генерувати
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
            onChange={(e) => setThemesText(e.target.value)}
          />
        </section>

        {/* 🔹 Праворуч — історія архівів */}
        {archives.length > 0 && (
          <section className="column column-right">
            <h3>Сгенеровані архіви</h3>
            <ul>
              {archives.map((archive, index) => (
                <li key={index} className="archive-item">
                  <a href="#" download>
                    📦 {archive.name}
                  </a>
                  <ul className="sub-list">
                    {archive.sites.map((site, i) => (
                      <li key={i}>└─ {site}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
