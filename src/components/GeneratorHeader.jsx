import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsArrowLeftShort,
  BsGear,
  BsHouseDoor,
  BsFileEarmarkText,
} from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GeneratorHeader.css";

export default function GeneratorHeader() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.info("🚪 Ви вийшли із системи");
      navigate("/");
    },
    onError: (err) => {
      toast.error("❌ Помилка виходу: " + (err.message || "невідома"));
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(); // запускаємо запит
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* === HEADER === */}
      <header className="generator-header">
        <div className="left-section">
          <button
            className="sidebar-toggle-btn"
            onClick={handleSidebarToggle}
            aria-label="Відкрити сайдбар"
          >
            <BsArrowLeftShort size={20} />
          </button>
          <h1 className="app-title">WhiteGen</h1>
        </div>

        <div className="header-buttons">
          <button
            className="btn logout-btn"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Вихід..." : "Вийти"}
          </button>
        </div>
      </header>

      {/* === SIDEBAR === */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={handleSidebarToggle}>
          ✕
        </button>
        <nav className="sidebar-nav">
          <button
            style={{ marginTop: "52px" }}
            onClick={() => navigate("/generator")}
          >
            <BsHouseDoor /> Генератор
          </button>
          <button onClick={() => navigate("/instructions")}>
            <BsFileEarmarkText /> Інструкція
          </button>
          <button onClick={() => navigate("/apikeys")}>
            <BsGear /> API Ключі
          </button>
        </nav>
      </div>

      {/* === OVERLAY === */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={handleSidebarToggle}></div>
      )}
    </>
  );
}
