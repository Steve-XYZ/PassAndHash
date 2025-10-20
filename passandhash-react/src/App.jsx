import React, { useState, useEffect } from 'react';
import HashGenerator from './components/HashGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import HashVerifier from './components/HashVerifier';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.body.className = theme + '-mode';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="container">
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
      </button>
      <HashGenerator />
      <PasswordGenerator />
      <HashVerifier />
    </div>
  );
}

export default App;