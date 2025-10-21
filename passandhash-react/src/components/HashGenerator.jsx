import React, { useState } from "react";

// 1. IMPORTACIONES ORGANIZADAS
// Se importa la lógica de hashing desde un archivo de utilidades para mantener este componente limpio.
import { generateHashWithOptions } from "../utils/cryptoUtils";
// Se importan componentes reutilizables
import StrengthMeter from "./StrengthMeter";
import { EyeIcon, EyeSlashIcon } from "./Icons"; // Asumiendo que creaste un archivo Icons.jsx
import { useToast } from "../hooks/useToast"; // Asumiendo que moviste ToastContainer a /contexts

const HashGenerator = () => {
  // --- 2. ESTADO CENTRALIZADO Y MÁS LIMPIO ---
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState("bcrypt");

  // Opciones agrupadas por algoritmo para un estado más limpio y escalable.
  const [bcryptOptions, setBcryptOptions] = useState({ rounds: 10 });
  const [argonOptions, setArgonOptions] = useState({
    memoryCost: 4096, // Valor inicial un poco más robusto
    iterations: 3,
    parallelism: 1,
  });

  const [result, setResult] = useState({
    hash: "",
    isLoading: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const showToast = useToast();

  // --- 3. LÓGICA DE MANEJO DE EVENTOS (HANDLERS) ---

  /**
   * Maneja la generación del hash. La lógica compleja ahora está delegada.
   */
  const handleGenerateHash = async () => {
    if (!password) {
      showToast("Por favor ingresa una contraseña", "warning");
      return;
    }

    setResult({ hash: "Generando hash, por favor espera...", isLoading: true });

    try {
      // Un solo objeto de opciones que se pasa a la función de utilidad.
      const options = {
        password,
        algorithm,
        ...bcryptOptions,
        ...argonOptions,
      };
      const generatedHash = await generateHashWithOptions(options);
      setResult({ hash: generatedHash, isLoading: false });
    } catch (error) {
      console.error("Error al generar hash:", error); // Loguear el error real para depuración
      showToast(`Error: ${error.message}`, "error");
      setResult({ hash: "Error al generar el hash.", isLoading: false });
    }
  };

  /**
   * Maneja el copiado al portapapeles.
   */
  const handleCopyToClipboard = () => {
    if (!result.hash || result.isLoading || result.hash.startsWith("Error")) {
      showToast("No hay un hash válido para copiar", "warning");
      return;
    }
    navigator.clipboard.writeText(result.hash).then(() => {
      showToast("¡Hash copiado al portapapeles!", "success");
    });
  };

  // --- 4. RENDERIZADO CONDICIONAL DE OPCIONES ---

  /**
   * Renderiza los campos de opciones específicas para cada algoritmo.
   * Ahora es un componente interno para mayor claridad.
   */
  const AlgorithmOptions = () => {
    switch (algorithm) {
      case "bcrypt":
        return (
          <div className="input-group">
            <label htmlFor="rounds">Rounds (complejidad):</label>
            <input
              type="number"
              id="rounds"
              value={bcryptOptions.rounds}
              min="4"
              max="15"
              onChange={(e) =>
                setBcryptOptions({
                  ...bcryptOptions,
                  rounds: parseInt(e.target.value, 10),
                })
              }
              disabled={result.isLoading}
            />
            <div className="rounds-info">
              Recomendado: 10-12. Más rounds = más seguro pero más lento
            </div>
          </div>
        );
      case "argon2":
        return (
          <>
            <div className="input-group">
              <label htmlFor="memoryCost">Costo de Memoria (KiB):</label>
              <input
                type="number"
                id="memoryCost"
                value={argonOptions.memoryCost}
                onChange={(e) =>
                  setArgonOptions({
                    ...argonOptions,
                    memoryCost: parseInt(e.target.value, 10),
                  })
                }
                disabled={result.isLoading}
              />
            </div>
            {/* Repetir para iterations y parallelism */}
          </>
        );
      default:
        return null; // SHA no tiene opciones configurables
    }
  };

  // --- 5. JSX DEL COMPONENTE PRINCIPAL ---

  return (
    <div className="generator-section">
      <h2>🔐 Generador de Hash</h2>
      <p className="subtitle">Genera un hash seguro para tu contraseña</p>

      {/* Selector de Algoritmo */}
      <div className="input-group">
        <label htmlFor="algorithm">Algoritmo:</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={result.isLoading}
        >
          <option value="bcrypt">bcrypt</option>
          <option value="argon2">Argon2</option>
          <option value="sha256">SHA-256</option>
          <option value="sha512">SHA-512</option>
        </select>
      </div>

      {/* Input de Contraseña */}
      <div className="input-group">
        <label htmlFor="hash-password">Contraseña:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="hash-password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={result.isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
        <StrengthMeter password={password} />
      </div>

      {/* Opciones Específicas del Algoritmo */}
      <AlgorithmOptions />

      {/* Botón de Generar */}
      <button
        className="generate-btn"
        onClick={handleGenerateHash}
        disabled={result.isLoading}
      >
        {result.isLoading ? (
          <>
            <span className="spinner"></span>
            Generando...
          </>
        ) : (
          "Generar Hash"
        )}
      </button>

      {/* Sección de Resultado */}
      <div className="result-section">
        <div className="result-label">✅ Tu hash generado:</div>
        <div className="hash-display">{result.hash}</div>
        <button className="copy-btn" onClick={handleCopyToClipboard}>
          📋 Copiar Hash
        </button>
      </div>
    </div>
  );
};

export default HashGenerator;
