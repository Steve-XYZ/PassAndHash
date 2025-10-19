// --- 1. CONSTANTES Y VARIABLES GLOBALES ---
const bcrypt = dcodeIO.bcrypt;
let currentHash = "";

// Referencias a los elementos del DOM
const passwordInput = document.getElementById("password");
const roundsInput = document.getElementById("rounds");
const generateBtn = document.getElementById("generateBtn");
const hashDisplay = document.getElementById("hashDisplay");
const copyBtn = document.getElementById("copyBtn");
const togglePasswordBtn = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eye-icon");
const eyeSlashIcon = document.getElementById("eye-slash-icon");
const strengthMeter = document.getElementById("password-strength-meter");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

// Nuevas referencias para el generador de contraseñas aleatorias
const passwordLengthInput = document.getElementById("passwordLength");
const includeUppercaseCheckbox = document.getElementById("includeUppercase");
const includeLowercaseCheckbox = document.getElementById("includeLowercase");
const includeNumbersCheckbox = document.getElementById("includeNumbers");
const includeSymbolsCheckbox = document.getElementById("includeSymbols");
const generateRandomPasswordBtn = document.getElementById("generateRandomPasswordBtn");
const randomPasswordDisplay = document.getElementById("randomPasswordDisplay");
const copyRandomPasswordBtn = document.getElementById("copyRandomPasswordBtn");


// --- 2. DEFINICIÓN DE FUNCIONES ---

/**
 * Genera el hash bcrypt a partir de la contraseña y los rounds.
 */
async function generateHash() {
  const password = passwordInput.value;
  const rounds = parseInt(roundsInput.value);

  if (!password) {
    alert("Por favor ingresa una contraseña");
    return;
  }

  if (isNaN(rounds) || rounds < 4 || rounds > 15) {
    alert("Los rounds deben estar entre 4 y 15");
    return;
  }

  // Mostrar estado de carga
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="spinner"></span>Generando hash...';
  hashDisplay.textContent = "Generando hash seguro, por favor espera...";
  hashDisplay.style.color = "#666";

  try {
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(password, salt);

    currentHash = hash;
    hashDisplay.textContent = hash;
    hashDisplay.style.color = "#000";
    hashDisplay.style.fontWeight = "bold";
  } catch (error) {
    alert("Error al generar el hash: " + error.message);
    hashDisplay.textContent = "Error al generar el hash";
    hashDisplay.style.color = "#dc3545";
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = "Generar Hash";
  }
}

/**
 * Copia el hash generado al portapapeles.
 */
function copyHash() {
  if (!currentHash) {
    alert("Primero debes generar un hash");
    return;
  }

  navigator.clipboard.writeText(currentHash).then(() => {
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = "✅ ¡Copiado al Portapapeles!";
    copyBtn.style.background = "#218838";

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.background = "#28a745";
    }, 2500);
  }).catch((err) => {
    alert("Error al copiar: " + err);
  });
}

/**
 * Muestra u oculta la contraseña en el input.
 */
function togglePasswordVisibility() {
  const isPassword = passwordInput.type === "password";
  if (isPassword) {
    passwordInput.type = "text";
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.display = "block";
  } else {
    passwordInput.type = "password";
    eyeIcon.style.display = "block";
    eyeSlashIcon.style.display = "none";
  }
}

/**
 * Actualiza el medidor de fortaleza de la contraseña.
 */
function updateStrengthMeter() {
  const password = passwordInput.value;
  const strength = checkPasswordStrength(password);

  if (password.length === 0) {
    strengthMeter.style.visibility = "hidden";
  } else {
    strengthMeter.style.visibility = "visible";
  }

  strengthBar.style.width = strength.width;
  strengthText.textContent = strength.text;

  strengthBar.className = "strength-bar";
  strengthText.className = "strength-text";
  strengthBar.classList.add(strength.class);
  strengthText.classList.add(strength.class);
}

/**
 * Calcula la fortaleza de una contraseña y devuelve un objeto con los resultados.
 * @param {string} password La contraseña a evaluar.
 * @returns {{text: string, width: string, class: string}}
 */
function checkPasswordStrength(password) {
  let score = 0;
  const checks = [
    /.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/
  ];

  checks.forEach(regex => {
    if (regex.test(password)) {
      score++;
    }
  });

  switch (score) {
    case 0:
    case 1:
    case 2:
      return { text: "Débil", width: "25%", class: "weak" };
    case 3:
      return { text: "Media", width: "50%", class: "medium" };
    case 4:
      return { text: "Fuerte", width: "75%", class: "strong" };
    case 5:
      return { text: "Muy Fuerte", width: "100%", class: "very-strong" };
    default:
      return { text: "", width: "0%", class: "" };
  }
}

// --- 3. EVENT LISTENERS ---

// Generar hash al hacer clic en el botón
generateBtn.addEventListener('click', generateHash);

// Copiar hash al hacer clic en el botón
copyBtn.addEventListener('click', copyHash);

// Mostrar/ocultar contraseña al hacer clic en el ojo
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

// Actualizar medidor de fortaleza mientras se escribe
passwordInput.addEventListener('input', updateStrengthMeter);

// Permitir generar con la tecla Enter
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') generateHash();
});
roundsInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') generateHash();
});

// Event listeners para el generador de contraseñas aleatorias
generateRandomPasswordBtn.addEventListener('click', generateRandomPassword);
copyRandomPasswordBtn.addEventListener('click', copyRandomPassword);
