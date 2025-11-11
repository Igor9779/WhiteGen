import { api } from "./axiosInstance";

// Реєстрація
export const registerUser = async ({ email, password }) => {
  const res = await api.post("/auth/registration", { email, password });
  return res.data;
};

// Логін
export const loginUser = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// Підтвердження 2FA
export const confirmUser = async ({ email, code }) => {
  const res = await api.post("/auth/confirm", { email, code });
  return res.data;
};

// Вихід
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const checkAuth = async () => {
  const res = await api.post("/auth/check-auth");
  return res.data;
};

// Скидання / оновлення пароля
export const resetPassword = async ({ password, confirmPassword }) => {
  const res = await api.post("/auth/reset-password", {
    password,
    confirmPassword,
  });
  return res.data;
};

// 🔹 Надсилання листа для відновлення пароля
export const sendRecoveryLink = async (email) => {
  const res = await api.post("/auth/recovery-send-activation-link", { email });
  return res.data;
};

// 🔹 Встановлення нового пароля за токеном
export const setNewPassword = async ({ token, password }) => {
  const res = await api.post("/auth/recovery-set-password", {
    token,
    password,
  });
  return res.data;
};

// 🔹 Зміна пароля без введення старого (для авторизованого користувача)
export const changePassword = async ({ newPassword }) => {
  const res = await api.post("/auth/change-password", {
    newPassword,
  });
  return res.data;
};
