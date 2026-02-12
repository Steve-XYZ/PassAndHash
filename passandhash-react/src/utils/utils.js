// src/utils/cryptoUtils.js

import bcrypt from "bcryptjs";
import argon2 from "../lib/argon2.js";

const clampInteger = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
};

const toHex = (buffer) => {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const generateHashWithOptions = async (options) => {
  const { algorithm, password, rounds, memoryCost, iterations, parallelism } =
    options;

  switch (algorithm) {
    case "bcrypt": {
      const safeRounds = clampInteger(rounds, 4, 15, 10);
      if (safeRounds < 4 || safeRounds > 15) {
        throw new Error("Los rounds de bcrypt deben estar entre 4 y 15");
      }
      const salt = await bcrypt.genSalt(safeRounds);
      return bcrypt.hash(password, salt);
    }

    case "argon2": {
      const safeMemoryCost = clampInteger(memoryCost, 1024, 65536, 4096);
      const safeIterations = clampInteger(iterations, 1, 10, 3);
      const safeParallelism = clampInteger(parallelism, 1, 4, 1);
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const hashResult = await argon2.hash({
        pass: password,
        salt: salt,
        time: safeIterations,
        mem: safeMemoryCost,
        parallelism: safeParallelism,
        type: argon2.ArgonType.Argon2id,
      });
      return hashResult.encoded;
    }

    case "sha256":
    case "sha512": {
      const msgUint8 = new TextEncoder().encode(password);
      const algo = algorithm === "sha256" ? "SHA-256" : "SHA-512";
      const hashBuffer = await window.crypto.subtle.digest(algo, msgUint8);
      return toHex(hashBuffer);
    }

    default:
      throw new Error("Algoritmo no soportado");
  }
};
/**
 * Verifica una contraseña en texto plano contra un hash existente.
 * @param {object} options Opciones para la verificación.
 * @returns {Promise<boolean>} Devuelve true si coinciden, false si no.
 */
export const verifyHashWithOptions = async (options) => {
  const { algorithm, password, hash } = options;

  switch (algorithm) {
    case "bcrypt": {
      return bcrypt.compare(password, hash);
    }
    case "argon2": {
      return argon2.verify({ pass: password, encoded: hash });
    }
    case "sha256":
    case "sha512": {
      const generatedHash = await generateHashWithOptions({
        algorithm,
        password,
      });
      return generatedHash.toLowerCase() === hash.trim().toLowerCase();
    }
    default:
      throw new Error("Algoritmo no soportado para verificación");
  }
};
