// src/pages/HomePage.jsx
import HashGenerator from "../components/HashGenerator";
import PasswordGenerator from "../components/PasswordGenerator";
import HashVerifier from "../components/HashVerifier";
import HashCracker from "../components/HashCracker";
import ThemeToggle from "../components/ThemeToggle"; // Importamos el nuevo componente
import LanguageSelector from "../components/LanguageSelector";
import { useI18n } from "../hooks/useI18n";

const HomePage = () => {
  const { t } = useI18n();

  return (
    <main className="container" aria-label="PassAndHash">
      <h1 className="page-title">{t("app.title")}</h1>
      <div className="top-bar">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <div className="tools-grid">
        <HashGenerator />
        <PasswordGenerator />
        <HashVerifier />
        <HashCracker />
      </div>
    </main>
  );
};

export default HomePage;
