const argon2 = globalThis.argon2;

if (!argon2) {
  throw new Error(
    "Argon2 no esta disponible. Verifica que /argon2-bundled.min.js cargue antes de main.jsx."
  );
}

export default argon2;
