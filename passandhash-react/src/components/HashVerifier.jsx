import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import * as argon2 from 'argon2-browser';
import { useToast } from './ToastContainer';
import { useToast } from './ToastContainer';
import { useToast } from './ToastContainer';
import { useToast } from './ToastContainer';

const HashVerifier = () => {
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [algorithm, setAlgorithm] = useState('bcrypt');
  const [result, setResult] = useState('');
  const [verifying, setVerifying] = useState(false);
  const showToast = useToast();

  const verifyHash = async () => {
    if (!password || !hash) {
      showToast('Por favor ingresa la contraseña y el hash', 'error');
      return;
    }

    setVerifying(true);
    setResult('Verificando...');

    try {
      let match = false;
      switch (algorithm) {
        case 'bcrypt':
          match = await bcrypt.compare(password, hash);
          break;
        case 'argon2':
          match = await argon2.verify({ pass: password, encoded: hash });
          break;
        default:
          throw new Error('Algoritmo no soportado para verificación');
      }
      setResult(match ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden');
    } catch (error) {
      showToast('Error al verificar el hash: ' + error.message, 'error');
      setResult('Error al verificar el hash');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="generator-section">
      <h2>Verificador de Hash</h2>
      <div className="input-group">
        <label htmlFor="verify-algorithm">Algoritmo:</label>
        <select id="verify-algorithm" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
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
        />
      </div>
      <button
        className="generate-btn"
        onClick={verifyHash}
        disabled={verifying}
      >
        {verifying ? (
          <>
            <span className="spinner"></span>Verificando...
          </>
        ) : (
          'Verificar Hash'
        )}
      </button>
      <div className="result-section">
        <div className="result-label">Resultado:</div>
        <div className="hash-display">{result}</div>
      </div>
    </div>
  );
};

export default HashVerifier;