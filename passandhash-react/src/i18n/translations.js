export const translations = {
  es: {
    app: {
      title: "PassAndHash",
    },
    common: {
      copyHash: "📋 Copiar Hash",
      copyPassword: "📋 Copiar Contraseña",
      generatedHash: "✅ Tu hash generado:",
      result: "Resultado:",
      language: "Idioma",
      security: {
        generatedPasswordLabel: "Contraseña Generada:",
      },
    },
    theme: {
      darkMode: "🌙 Modo Oscuro",
      lightMode: "☀️ Modo Claro",
    },
    hashGenerator: {
      title: "🔐 Generador de Hash",
      subtitle: "Genera un hash seguro para tu contraseña",
      algorithm: "Algoritmo:",
      presetLabel: "Preset de seguridad:",
      password: "Contraseña:",
      passwordPlaceholder: "Ingresa tu contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      rounds: "Rounds (complejidad):",
      roundsHint: "Recomendado: 10-12. Más rounds = más seguro pero más lento",
      memoryCost: "Costo de Memoria (KiB):",
      iterations: "Iteraciones:",
      parallelism: "Paralelismo:",
      generate: "Generar Hash",
      loading: "Generando...",
      restoreDefaults: "Restaurar valores por defecto",
      presets: {
        basic: "Básico",
        recommended: "Recomendado",
        high: "Alto",
        light: "Ligero",
        robust: "Robusto",
        custom: "Personalizado",
      },
    },
    hashVerifier: {
      title: "Verificador de Hash",
      algorithm: "Algoritmo:",
      plainPassword: "Contraseña en texto plano:",
      plainPasswordPlaceholder: "Ingresa la contraseña",
      hash: "Hash:",
      hashPlaceholder: "Ingresa el hash a verificar",
      verify: "Verificar Hash",
      loading: "Verificando...",
      idle: "El resultado aparecerá aquí",
      match: "✅ ¡Coinciden! El hash corresponde a la contraseña.",
      mismatch: "❌ No coinciden. El hash es incorrecto.",
      error: "❗️ Hubo un error durante la verificación.",
    },
    passwordGenerator: {
      title: "Generador de Contraseña Aleatoria",
      length: "Longitud:",
      charTypes: "Tipos de caracteres",
      uppercase: "Mayúsculas (A-Z)",
      lowercase: "Minúsculas (a-z)",
      numbers: "Números (0-9)",
      symbols: "Símbolos (!@#$)",
      generate: "Generar Contraseña",
      placeholder: "Aquí aparecerá tu contraseña",
    },
    messages: {
      requiredPassword: "Por favor ingresa una contraseña",
      requiredHash: "Por favor ingresa un hash",
      requiredPasswordAndHash: "Por favor ingresa la contraseña y el hash",
      passwordTooLong: "La contraseña excede el máximo permitido ({max}).",
      hashTooLong: "El hash excede el máximo permitido ({max}).",
      unsupportedAlgorithm: "El algoritmo seleccionado no es soportado.",
      invalidHashToCopy: "No hay un hash válido para copiar",
      hashCopied: "¡Hash copiado al portapapeles!",
      hashCopyError: "No fue posible copiar el hash.",
      passwordCopied: "¡Contraseña copiada al portapapeles!",
      passwordCopyError: "No fue posible copiar la contraseña.",
      generatePasswordSuccess: "¡Nueva contraseña generada!",
      generatePasswordFirst: "Primero debes generar una contraseña.",
      pickAtLeastOneCharType: "Por favor selecciona al menos un tipo de caracter.",
      minLengthForCharTypes:
        "La longitud debe ser al menos {min} para incluir todos los tipos de caracteres seleccionados.",
      genericError: "Error: {message}",
      hashGenerationFailed: "Error al generar el hash.",
      hashVerificationFailed: "Error al verificar el hash.",
    },
  },
  en: {
    app: {
      title: "PassAndHash",
    },
    common: {
      copyHash: "📋 Copy Hash",
      copyPassword: "📋 Copy Password",
      generatedHash: "✅ Generated hash:",
      result: "Result:",
      language: "Language",
      security: {
        generatedPasswordLabel: "Generated Password:",
      },
    },
    theme: {
      darkMode: "🌙 Dark Mode",
      lightMode: "☀️ Light Mode",
    },
    hashGenerator: {
      title: "🔐 Hash Generator",
      subtitle: "Generate a secure hash for your password",
      algorithm: "Algorithm:",
      presetLabel: "Security preset:",
      password: "Password:",
      passwordPlaceholder: "Enter your password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      rounds: "Rounds (cost):",
      roundsHint: "Recommended: 10-12. More rounds = safer but slower",
      memoryCost: "Memory Cost (KiB):",
      iterations: "Iterations:",
      parallelism: "Parallelism:",
      generate: "Generate Hash",
      loading: "Generating...",
      restoreDefaults: "Restore defaults",
      presets: {
        basic: "Basic",
        recommended: "Recommended",
        high: "High",
        light: "Light",
        robust: "Robust",
        custom: "Custom",
      },
    },
    hashVerifier: {
      title: "Hash Verifier",
      algorithm: "Algorithm:",
      plainPassword: "Plain-text password:",
      plainPasswordPlaceholder: "Enter the password",
      hash: "Hash:",
      hashPlaceholder: "Enter hash to verify",
      verify: "Verify Hash",
      loading: "Verifying...",
      idle: "The result will appear here",
      match: "✅ Match! The hash corresponds to the password.",
      mismatch: "❌ Mismatch. The hash is incorrect.",
      error: "❗️ There was an error during verification.",
    },
    passwordGenerator: {
      title: "Random Password Generator",
      length: "Length:",
      charTypes: "Character types",
      uppercase: "Uppercase (A-Z)",
      lowercase: "Lowercase (a-z)",
      numbers: "Numbers (0-9)",
      symbols: "Symbols (!@#$)",
      generate: "Generate Password",
      placeholder: "Your password will appear here",
    },
    messages: {
      requiredPassword: "Please enter a password",
      requiredHash: "Please enter a hash",
      requiredPasswordAndHash: "Please enter both password and hash",
      passwordTooLong: "Password exceeds the allowed max ({max}).",
      hashTooLong: "Hash exceeds the allowed max ({max}).",
      unsupportedAlgorithm: "Selected algorithm is not supported.",
      invalidHashToCopy: "There is no valid hash to copy",
      hashCopied: "Hash copied to clipboard!",
      hashCopyError: "Could not copy hash.",
      passwordCopied: "Password copied to clipboard!",
      passwordCopyError: "Could not copy password.",
      generatePasswordSuccess: "New password generated!",
      generatePasswordFirst: "Generate a password first.",
      pickAtLeastOneCharType: "Please select at least one character type.",
      minLengthForCharTypes:
        "Length must be at least {min} to include all selected character types.",
      genericError: "Error: {message}",
      hashGenerationFailed: "Error generating hash.",
      hashVerificationFailed: "Error verifying hash.",
    },
  },
};

const resolvePath = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

export const makeT = (language, fallbackLanguage = "es") => {
  return (key, vars = {}) => {
    const fromLanguage = resolvePath(translations[language], key);
    const fromFallback = resolvePath(translations[fallbackLanguage], key);
    const value = fromLanguage ?? fromFallback ?? key;
    if (typeof value !== "string") {
      return key;
    }
    return value.replace(/\{(\w+)\}/g, (_, token) => {
      return vars[token] != null ? String(vars[token]) : `{${token}}`;
    });
  };
};
