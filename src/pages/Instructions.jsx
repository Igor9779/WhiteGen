import "./Instructions.css";

export default function Instructions() {
  return (
    <>
      <section className="instructions-page">
        <div className="container">
          <h2 className="instructions-title">Інструкція користувача</h2>
          <p className="intro-text">
            Цей розділ допоможе вам зрозуміти, як користуватись системою{" "}
            <strong>WhiteGen</strong>. Нижче описані основні кроки, можливості
            та рекомендації для ефективної роботи.
          </p>

          <div className="instruction-section">
            <h3>1. Вхід у систему</h3>
            <p>
              Для початку роботи перейдіть на головну сторінку та авторизуйтесь
              за допомогою свого облікового запису. Якщо у вас немає акаунта —
              натисніть кнопку <strong>“Реєстрація”</strong> та створіть новий
              профіль.
            </p>
          </div>

          <div className="instruction-section">
            <h3>2. Генератор сайтів</h3>
            <p>
              На сторінці <strong>Generator</strong> можна створювати шаблони
              сайтів. Вкажіть необхідні параметри, оберіть стиль (Bootstrap або
              Tailwind), заповніть поля для ClickUp та гео-коду, а потім
              натисніть <strong>“Генерувати”</strong>.
            </p>
            <pre className="code-block">
              {`Приклад заповнення:
Tailwind / Bootstrap: Bootstrap
Command Number: 48516
Task ID: 2333
Language: en
Geo: CH`}
            </pre>
          </div>

          <div className="instruction-section">
            <h3>3. Налаштування API ключів</h3>
            <p>
              У розділі <strong>API Keys</strong> ви можете ввести{" "}
              <em>Telegram Chat ID</em>
              для отримання статусів у Telegram, а також <em>
                ClickUp Token
              </em>{" "}
              для відправлення коментарів. Після заповнення обох полів натисніть{" "}
              <strong>“Відправити дані”</strong>.
            </p>
          </div>

          <div className="instruction-section">
            <h3>4. Додаткові можливості</h3>
            <ul>
              <li>Перегляд інструкцій у зручному форматі прямо в панелі.</li>
              <li>Інтеграція з ClickUp для автоматизації процесів.</li>
              <li>Зручний обмін даними через Telegram-бота.</li>
              <li>Можливість розширення проєкту новими модулями.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
