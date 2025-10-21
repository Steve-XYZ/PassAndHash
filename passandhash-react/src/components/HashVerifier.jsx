import React, { useState } from "react";
// Importamos nuestra nueva función de utilidad
import { verifyHashWithOptions } from "../utils/cryptoUtils";
import { useToast } from "../hooks/useToast";

const HashVerifier = () => {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [algorithm, setAlgorithm] = useState("bcrypt");

  // 1. Estado de resultado mejorado: almacena un 'status' para estilizar la UI
  const [result, setResult] = useState({
    status: "idle",
    message: "El resultado aparecerá aquí",
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const showToast = useToast();

  const handleVerifyHash = async () => {
    if (!password || !hash) {
      showToast("Por favor ingresa la contraseña y el hash", "warning");
      return;
    }

    setIsVerifying(true);
    setResult({ status: "verifying", message: "Verificando..." });

    try {
      // 2. La lógica compleja ahora es una sola llamada a nuestra utilidad
      const options = { algorithm, password, hash };
      const match = await verifyHashWithOptions(options);

      // 3. Actualizamos el estado con un status semántico
      if (match) {
        setResult({
          status: "match",
          message: "✅ ¡Coinciden! El hash corresponde a la contraseña.",
        });
      } else {
        setResult({
          status: "mismatch",
          message: "❌ No coinciden. El hash es incorrecto.",
        });
      }
    } catch (error) {
      console.error("Error al verificar:", error);
      showToast(`Error: ${error.message}`, "error");
      setResult({
        status: "error",
        message: "❗️ Hubo un error durante la verificación.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="generator-section">
      <h2>Verificador de Hash</h2>
      <div className="input-group">
        <label htmlFor="verify-algorithm">Algoritmo:</label>
        <select
          id="verify-algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isVerifying}
        >
          <option value="bcrypt">bcrypt</option>
          <option value="argon2">Argon2</option>
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="verify-password">Contraseña en texto plano:</label>
        <input
          type="text"
          id="verify-password"
          placeholder="Ingresa la contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isVerifying}
        />
      </div>
      <div className="input-group">
        <label htmlFor="verify-hash">Hash:</label>
        <input
          type="text"
          id="verify-hash"
          placeholder="Ingresa el hash a verificar"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          disabled={isVerifying}
        />
      </div>
      <button
        className="generate-btn"
        onClick={handleVerifyHash}
        disabled={isVerifying}
      >
        {isVerifying ? (
          <>
            <span className="spinner"></span>Verificando...
          </>
        ) : (
          "Verificar Hash"
        )}
      </button>
      <div className="result-section">
        <div className="result-label">Resultado:</div>
        {/* 4. El display ahora tiene una clase dinámica basada en el status del resultado */}
        <div className={`hash-display result--${result.status}`}>
          {result.message}
        </div>
      </div>
    </div>
  );
};

export default HashVerifier;
