import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import * as argon2 from 'argon2-browser';
import StrengthMeter from './StrengthMeter';
import { useToast } from './ToastContainer';

const HashGenerator = () => {
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('bcrypt');
  const [rounds, setRounds] = useState(10); // for bcrypt
  const [memoryCost, setMemoryCost] = useState(2048); // for argon2
  const [iterations, setIterations] = useState(2); // for argon2
  const [parallelism, setParallelism] = useState(1); // for argon2
  const [hash, setHash] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('📋 Copiar Hash al Portapapeles');
  const [showPassword, setShowPassword] = useState(false);
  const showToast = useToast();

  const generateHash = async () => {
    if (!password) {
      showToast('Por favor ingresa una contraseña', 'error');
      return;
    }

    setGenerating(true);
    setHash('Generando hash, por favor espera...');

    try {
      let generatedHash;
      switch (algorithm) {
        case 'bcrypt':
          if (rounds < 4 || rounds > 15) {
            showToast('Los rounds de bcrypt deben estar entre 4 y 15', 'error');
            setGenerating(false);
            return;
          }
          const salt = await bcrypt.genSalt(rounds);
          generatedHash = await bcrypt.hash(password, salt);
          break;
        case 'argon2':
          const argon2salt = window.crypto.getRandomValues(new Uint8Array(16));
          const argon2hash = await argon2.hash({
            pass: password,
            salt: argon2salt,
            time: iterations,
            mem: memoryCost,
            parallelism: parallelism,
            type: argon2.ArgonType.Argon2id,
          });
          generatedHash = argon2hash.encoded;
          break;
        case 'sha256':
        case 'sha512':
          const msgUint8 = new TextEncoder().encode(password);
          const hashBuffer = await window.crypto.subtle.digest(
            algorithm === 'sha256' ? 'SHA-256' : 'SHA-512',
            msgUint8
          );
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          generatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          break;
        default:
          throw new Error('Algoritmo no soportado');
      }
      setHash(generatedHash);
    } catch (error) {
      showToast('Error al generar el hash: ' + error.message, 'error');
      setHash('Error al generar el hash');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!hash || generating) {
      showToast('Primero debes generar un hash', 'warning');
      return;
    }
    navigator.clipboard.writeText(hash).then(() => {
      setCopyButtonText('✅ ¡Copiado al Portapapeles!');
      setTimeout(() => {
        setCopyButtonText('📋 Copiar Hash al Portapapeles');
      }, 2500);
    });
  };

  const renderOptions = () => {
    switch (algorithm) {
      case 'bcrypt':
        return (
          <div className="input-group">
            <label htmlFor="rounds">Rounds (complejidad):</label>
            <input
              type="number"
              id="rounds"
              value={rounds}
              min="4"
              max="15"
              onChange={(e) => setRounds(parseInt(e.target.value))}
            />
            <div className="rounds-info">
              Recomendado: 10-12. Más rounds = más seguro pero más lento
            </div>
          </div>
        );
      case 'argon2':
        return (
          <>
            <div className="input-group">
              <label htmlFor="memoryCost">Costo de Memoria (KB):</label>
              <input
                type="number"
                id="memoryCost"
                value={memoryCost}
                onChange={(e) => setMemoryCost(parseInt(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="iterations">Iteraciones:</label>
              <input
                type="number"
                id="iterations"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="parallelism">Paralelismo:</label>
              <input
                type="number"
                id="parallelism"
                value={parallelism}
                onChange={(e) => setParallelism(parseInt(e.target.value))}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1>🔐 Generador de Hash</h1>
      <p className="subtitle">
        Genera un hash seguro para tu contraseña
      </p>

      <div className="input-group">
        <label htmlFor="algorithm">Algoritmo:</label>
        <select id="algorithm" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="bcrypt">bcrypt</option>
          <option value="argon2">Argon2</option>
          <option value="sha256">SHA-256</option>
          <option value="sha512">SHA-512</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="password">Contraseña:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        <StrengthMeter password={password} />
      </div>

      {renderOptions()}

      <button
        className="generate-btn"
        onClick={generateHash}
        disabled={generating}
      >
        {generating ? (
          <>
            <span className="spinner"></span>Generando hash...
          </>
        ) : (
          'Generar Hash'
        )}
      </button>

      <div className="result-section">
        <div className="result-label">✅ Tu hash generado:</div>
        <div className="hash-display">{hash}</div>
        <button className="copy-btn" onClick={copyToClipboard}>
          {copyButtonText}
        </button>
      </div>

      <div className="security-note">
        <strong>⚠️ Nota de Seguridad:</strong>
        Este hash se genera localmente en tu navegador. Tu contraseña NO se
        envía a ningún servidor. Guarda el hash generado en tu base de datos,
        nunca guardes la contraseña en texto plano.
      </div>
    </div>
  );
};

export default HashGenerator;