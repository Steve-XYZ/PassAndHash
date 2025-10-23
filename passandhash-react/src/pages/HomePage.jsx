// src/pages/HomePage.jsx
import React from "react";
import HashGenerator from "../components/HashGenerator";
import PasswordGenerator from "../components/PasswordGenerator";
import HashVerifier from "../components/HashVerifier";
import ThemeToggle from "../components/ThemeToggle"; // Importamos el nuevo componente

const HomePage = () => {
  return (
    <div className="container">
      <ThemeToggle />
      <HashGenerator />
      <PasswordGenerator />
      <HashVerifier />
    </div>
  );
};

export default HomePage;
