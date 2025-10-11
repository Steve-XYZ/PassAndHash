const bcrypt = dcodeIO.bcrypt;
let currentHash = "";

async function generateHash() {
  const password = passwordInput.value;
  const rounds = parseInt(document.getElementById("rounds").value);
  const btn = document.getElementById("generateBtn");
  const hashDisplay = document.getElementById("hashDisplay");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eye-icon");
  const eyeSlashIcon = document.getElementById("eye-slash-icon");

  if (!password) {
    alert("Por favor ingresa una contraseña");
    return;
  }

  if (rounds < 4 || rounds > 15) {
    alert("Los rounds deben estar entre 4 y 15");
    return;
  }

  // Mostrar estado de carga
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Generando hash...';
  hashDisplay.textContent = "Generando hash seguro, por favor espera...";
  hashDisplay.style.color = "#666";

  try {
    // Generar el salt
    const salt = await bcrypt.genSalt(rounds);

    // Generar el hash
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
    btn.disabled = false;
    btn.innerHTML = "Generar Hash";
  }
}

function copyHash() {
  if (!currentHash) {
    alert("Primero debes generar un hash");
    return;
  }

  navigator.clipboard
    .writeText(currentHash)
    .then(() => {
      const btn = document.getElementById("copyBtn");
      const originalText = btn.innerHTML;
      btn.innerHTML = "✅ ¡Copiado al Portapapeles!";
      btn.style.background = "#218838";

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "#28a745";
      }, 2500);
    })
    .catch((err) => {
      alert("Error al copiar: " + err);
    });
}

// Permitir generar con Enter
document.getElementById("password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateHash();
});

document.getElementById("rounds").addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateHash();
});
togglePasswordBtn.addEventListener("click", () => {
  // Comprueba el tipo actual del input
  const isPassword = passwordInput.type === "password";

  if (isPassword) {
    // Si es contraseña, cambiar a texto y mostrar el ojo tachado
    passwordInput.type = "text";
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.display = "block";
  } else {
    // Si es texto, cambiar a contraseña y mostrar el ojo normal
    passwordInput.type = "password";
    eyeIcon.style.display = "block";
    eyeSlashIcon.style.display = "none";
  }
});
