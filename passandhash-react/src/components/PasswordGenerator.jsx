import React, { useState } from 'react';
import { useToast } from './ToastContainer';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('📋 Copiar Contraseña');
  const showToast = useToast();

  const generatePassword = () => {
    let allowedChars = '';
    if (includeUppercase) allowedChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) allowedChars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) allowedChars += '0123456789';
    if (includeSymbols) allowedChars += '!@#$%^&*()_+[]{}|;:,.<>?';

    if (allowedChars.length === 0) {
      showToast('Por favor selecciona al menos un tipo de caracter.', 'error');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      newPassword += allowedChars[randomIndex];
    }

    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    if (!password) {
      showToast('Primero debes generar una contraseña aleatoria.', 'warning');
      return;
    }
    navigator.clipboard.writeText(password).then(() => {
      setCopyButtonText('✅ ¡Copiado al Portapapeles!');
      setTimeout(() => {
        setCopyButtonText('📋 Copiar Contraseña');
      }, 2500);
    });
  };

  return (
    <div className="generator-section">
      <h2>Generador de Contraseña Aleatoria</h2>
      <div className="input-group">
        <label htmlFor="passwordLength">Longitud:</label>
        <input
          type="number"
          id="passwordLength"
          value={length}
          min="4"
          max="64"
          onChange={(e) => setLength(e.target.value)}
        />
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeUppercase"
          checked={includeUppercase}
          onChange={() => setIncludeUppercase(!includeUppercase)}
        />
        <label htmlFor="includeUppercase">Mayúsculas (A-Z)</label>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeLowercase"
          checked={includeLowercase}
          onChange={() => setIncludeLowercase(!includeLowercase)}
        />
        <label htmlFor="includeLowercase">Minúsculas (a-z)</label>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeNumbers"
          checked={includeNumbers}
          onChange={() => setIncludeNumbers(!includeNumbers)}
        />
        <label htmlFor="includeNumbers">Números (0-9)</label>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeSymbols"
          checked={includeSymbols}
          onChange={() => setIncludeSymbols(!includeSymbols)}
        />
        <label htmlFor="includeSymbols">Símbolos (!@#$)</label>
      </div>
      <button className="generate-btn" onClick={generatePassword}>
        Generar Contraseña Aleatoria
      </button>
      <div className="result-section">
        <div className="result-label">Contraseña Generada:</div>
        <div className="hash-display">{password}</div>
        <button className="copy-btn" onClick={copyToClipboard}>
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
