// src/pages/HomePage.jsx
import HashGenerator from "../components/HashGenerator";
import PasswordGenerator from "../components/PasswordGenerator";
import HashVerifier from "../components/HashVerifier";
import ThemeToggle from "../components/ThemeToggle"; // Importamos el nuevo componente

const HomePage = () => {
  return (
    <div className="container">
      <div className="top-bar">
        <ThemeToggle />
      </div>
      <div className="tools-grid">
        <HashGenerator />
        <PasswordGenerator />
        <HashVerifier />
      </div>
    </div>
  );
};

export default HomePage;
