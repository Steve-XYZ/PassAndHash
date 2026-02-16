import { useState } from "react";
// Asumiendo que has movido el hook a su nueva ubicación
import { useToast } from "../hooks/useToast";
import { useI18n } from "../hooks/useI18n";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true); // <-- Cambiado a true por defecto, es una mejor práctica

  const showToast = useToast();
  const { t } = useI18n();

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
        t("messages.pickAtLeastOneCharType"),
        "warning"
      );
      return;
    }

    if (length < requiredChars.length) {
      showToast(
        t("messages.minLengthForCharTypes", { min: requiredChars.length }),
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
    showToast(t("messages.generatePasswordSuccess"), "success");
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
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      const j = randomValues[0] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const copyToClipboard = async () => {
    if (!password) {
      showToast(t("messages.generatePasswordFirst"), "warning");
      return;
    }
    try {
      await navigator.clipboard.writeText(password);
      showToast(t("messages.passwordCopied"), "success");
    } catch {
      showToast(t("messages.passwordCopyError"), "error");
    }
  };

  // --- JSX DEL COMPONENTE (SIN CAMBIOS) ---

  return (
    <section className="generator-section" aria-labelledby="password-generator-title">
      <h2 id="password-generator-title">{t("passwordGenerator.title")}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generatePassword();
        }}
      >
        <div className="input-group">
          <label htmlFor="passwordLength">{t("passwordGenerator.length")}</label>
          <input
            type="number"
            id="passwordLength"
            value={length}
            min="4"
            max="64"
            onChange={(e) =>
              setLength(Number.parseInt(e.target.value, 10) || 12)
            }
          />
        </div>
        <fieldset className="options-fieldset">
          <legend>{t("passwordGenerator.charTypes")}</legend>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeUppercase"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
            <label htmlFor="includeUppercase">{t("passwordGenerator.uppercase")}</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeLowercase"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
            />
            <label htmlFor="includeLowercase">{t("passwordGenerator.lowercase")}</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeNumbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            <label htmlFor="includeNumbers">{t("passwordGenerator.numbers")}</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeSymbols"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            <label htmlFor="includeSymbols">{t("passwordGenerator.symbols")}</label>
          </div>
        </fieldset>
        <button className="generate-btn" type="submit">
          {t("passwordGenerator.generate")}
        </button>
      </form>
      <div className="result-section">
        <div className="result-label">{t("common.security.generatedPasswordLabel")}</div>
        <div className="hash-display" role="status" aria-live="polite">
          {password || t("passwordGenerator.placeholder")}
        </div>
        <button className="copy-btn" onClick={copyToClipboard}>
          {t("common.copyPassword")}
        </button>
      </div>
    </section>
  );
};

export default PasswordGenerator;
