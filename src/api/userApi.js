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
  const res = await api.get("/auth/check-auth");
  return res.data;
};
