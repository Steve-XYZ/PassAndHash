// src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { useI18n } from "../hooks/useI18n";

const ThemeToggle = () => {
  const { t } = useI18n();
  // 1. La lógica del tema ahora vive aquí, encapsulada y autónoma.
  const [theme, setTheme] = useState(() => {
    // Leemos la preferencia guardada o usamos 'light' por defecto.
    return localStorage.getItem("theme") || "light";
  });

  // 2. El useEffect actualiza el body y guarda la preferencia.
  useEffect(() => {
    document.body.className = ""; // Limpiamos clases previas
    document.body.classList.add(theme + "-mode");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === "light" ? t("theme.darkMode") : t("theme.lightMode")}
    </button>
  );
};

export default ThemeToggle;
