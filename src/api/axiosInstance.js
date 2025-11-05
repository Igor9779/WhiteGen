import axios from "axios";

const BASE_URL = "https://gen-web-serv.onrender.com";

// 🔹 Базовий екземпляр axios
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // щоб працювали cookies (refreshToken)
});

// 🔹 Додатковий екземпляр для оновлення токену
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 🔁 Інтерсептор для відлову помилок 401
api.interceptors.response.use(
  (response) => response, // якщо все ок — просто повертаємо відповідь
  async (error) => {
    const originalRequest = error.config;

    // Якщо токен протух і це перша спроба оновлення
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 🔹 пробуємо оновити токен
        await refreshApi.get("/auth/refresh");
        // 🔹 після оновлення — повторюємо початковий запит
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token недійсний:", refreshError);
        // якщо навіть refresh не спрацював — кидаємо далі
        throw refreshError;
      }
    }

    // якщо помилка не 401 — просто кидаємо її
    throw error;
  }
);
