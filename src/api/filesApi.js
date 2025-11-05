import { api } from "./axiosInstance";

export const downloadArchive = async (whiteId) => {
  const res = await api.get(`/api/download/${whiteId}`, {
    responseType: "blob",
    withCredentials: true,
  });

  // створюємо посилання для завантаження
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${whiteId}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const generateLanding = async (payload) => {
  const res = await api.post("/api/generation", payload);
  return res.data;
};

export const getAllArchives = async () => {
  const res = await api.get("/api/generation");
  return res.data;
};