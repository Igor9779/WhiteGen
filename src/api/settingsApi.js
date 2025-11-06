import { api } from "./axiosInstance";

export const setClickupToken = async (clickupToken) => {
  const res = await api.post(
    "/settings/set-c-t",
    { ct: clickupToken },
    { withCredentials: true }
  );
  return res.data;
};

export const setTelegramChatId = async (chatId) => {
  const res = await api.post(
    "/settings/set-t-id",
    { tid: chatId },
    { withCredentials: true }
  );
  return res.data;
};

export const checkClickupToken = async () => {
  const res = await api.get(
    "/settings/check-c-t",

    { withCredentials: true }
  );
  return res.data;
};

export const checkTelegramChatId = async () => {
  const res = await api.get("/settings/check-t-id", { withCredentials: true });
  return res.data;
};
