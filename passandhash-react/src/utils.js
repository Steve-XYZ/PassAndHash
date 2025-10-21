// src/utils/cryptoUtils.js

import bcrypt from "bcryptjs";
import * as argon2 from "argon2-browser";

export const generateHashWithOptions = async (options) => {
  const { algorithm, password, rounds, memoryCost, iterations, parallelism } =
    options;

  switch (algorithm) {
    case "bcrypt": {
      // <--- Llave de apertura
      if (rounds < 4 || rounds > 15) {
        throw new Error("Los rounds de bcrypt deben estar entre 4 y 15");
      }
      const salt = await bcrypt.genSalt(rounds);
      return bcrypt.hash(password, salt);
    } // <--- Llave de cierre

    case "argon2": {
      // <--- Llave de apertura
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const hashResult = await argon2.hash({
        pass: password,
        salt: salt,
        time: iterations,
        mem: memoryCost,
        parallelism: parallelism,
        type: argon2.ArgonType.Argon2id,
      });
      return hashResult.encoded;
    } // <--- Llave de cierre

    case "sha256":
    case "sha512": {
      // <--- Llave de apertura
      const msgUint8 = new TextEncoder().encode(password);
      const algo = algorithm === "sha256" ? "SHA-256" : "SHA-512";
      const hashBuffer = await window.crypto.subtle.digest(algo, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } // <--- Llave de cierre

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
    case "bcrypt":
      // bcrypt.compare maneja errores de formato de hash internamente, devolviendo false.
      return bcrypt.compare(password, hash);

    case "argon2":
      // argon2.verify puede lanzar un error si el hash está malformado.
      return argon2.verify({ pass: password, encoded: hash });

    default:
      throw new Error("Algoritmo no soportado para verificación");
  }
};
