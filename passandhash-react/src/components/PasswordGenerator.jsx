import React, { useState } from "react";
// Asumiendo que has movido el hook a su nueva ubicación
import { useToast } from "../hooks/useToast";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true); // <-- Cambiado a true por defecto, es una mejor práctica

  const showToast = useToast();

  // --- LÓGICA DE GENERACIÓN DE CONTRASEÑA MEJORADA ---

  const generatePassword = () => {
    // 1. Definimos los conjuntos de caracteres
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charPool = "";
    const requiredChars = [];

    // 2. Construimos el "pool" de caracteres y garantizamos al menos uno de cada tipo seleccionado
    if (includeUppercase) {
      charPool += uppercaseChars;
      requiredChars.push(getRandomChar(uppercaseChars));
    }
    if (includeLowercase) {
      charPool += lowercaseChars;
      requiredChars.push(getRandomChar(lowercaseChars));
    }
    if (includeNumbers) {
      charPool += numberChars;
      requiredChars.push(getRandomChar(numberChars));
    }
    if (includeSymbols) {
      charPool += symbolChars;
      requiredChars.push(getRandomChar(symbolChars));
    }

    if (charPool.length === 0) {
      showToast(
        "Por favor selecciona al menos un tipo de caracter.",
        "warning"
      );
      return;
    }

    if (length < requiredChars.length) {
      showToast(
        `La longitud debe ser al menos ${requiredChars.length} para incluir todos los tipos de caracteres seleccionados.`,
        "error"
      );
      return;
    }

    // 3. Generamos el resto de la contraseña de forma aleatoria
    const remainingLength = length - requiredChars.length;
    let randomChars = "";
    for (let i = 0; i < remainingLength; i++) {
      randomChars += getRandomChar(charPool);
    }

    // 4. Combinamos los caracteres requeridos y los aleatorios, y luego los barajamos
    const unshuffledPassword = requiredChars.join("") + randomChars;
    setPassword(shuffleString(unshuffledPassword));
    showToast("¡Nueva contraseña generada!", "success");
  };

  /**
   * Obtiene un carácter aleatorio de una cadena de texto usando la API `window.crypto`.
   * @param {string} str La cadena de la que se extraerá el carácter.
   * @returns {string} Un carácter aleatorio y seguro.
   */
  const getRandomChar = (str) => {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return str[randomValues[0] % str.length];
  };

  /**
   * Baraja los caracteres de una cadena para evitar patrones predecibles.
   * (Ej: que los primeros caracteres sean siempre una mayúscula, una minúscula, un número...)
   * @param {string} str La cadena a barajar.
   * @returns {string} La cadena con sus caracteres en orden aleatorio.
   */
  const shuffleString = (str) => {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Math.random es seguro aquí, solo estamos barajando
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const copyToClipboard = () => {
    if (!password) {
      showToast("Primero debes generar una contraseña.", "warning");
      return;
    }
    navigator.clipboard.writeText(password).then(() => {
      showToast("¡Contraseña copiada al portapapeles!", "success");
    });
  };

  // --- JSX DEL COMPONENTE (SIN CAMBIOS) ---

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
          onChange={(e) => setLength(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeUppercase"
          checked={includeUppercase}
          onChange={(e) => setIncludeUppercase(e.target.checked)}
        />
        <label htmlFor="includeUppercase">Mayúsculas (A-Z)</label>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeLowercase"
          checked={includeLowercase}
          onChange={(e) => setIncludeLowercase(e.target.checked)}
        />
        <label htmlFor="includeLowercase">Minúsculas (a-z)</label>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeNumbers"
          checked={includeNumbers}
          onChange={(e) => setIncludeNumbers(e.target.checked)}
        />
        <label htmlFor="includeNumbers">Números (0-9)</label>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeSymbols"
          checked={includeSymbols}
          onChange={(e) => setIncludeSymbols(e.target.checked)}
        />
        <label htmlFor="includeSymbols">Símbolos (!@#$)</label>
      </div>
      <button className="generate-btn" onClick={generatePassword}>
        Generar Contraseña
      </button>
      <div className="result-section">
        <div className="result-label">Contraseña Generada:</div>
        <div className="hash-display">
          {password || "Aquí aparecerá tu contraseña"}
        </div>
        <button className="copy-btn" onClick={copyToClipboard}>
          📋 Copiar Contraseña
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
