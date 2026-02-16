import { useEffect, useState } from "react";

// 1. IMPORTACIONES ORGANIZADAS
// Se importa la lógica de hashing desde un archivo de utilidades para mantener este componente limpio.
import {
  ERROR_CODES,
  SECURITY_LIMITS,
  generateHashWithOptions,
} from "../utils/utils.js";
// Se importan componentes reutilizables
import StrengthMeter from "./StrengthMeter";
import { EyeIcon, EyeSlashIcon } from "./Icons"; // Asumiendo que creaste un archivo Icons.jsx
import { useToast } from "../hooks/useToast"; // Asumiendo que moviste ToastContainer a /contexts
import { useI18n } from "../hooks/useI18n";

const STORAGE_KEY = "hashGeneratorPreferences";

const BCRYPT_PRESETS = {
  basic: { rounds: 8 },
  recommended: { rounds: 10 },
  high: { rounds: 12 },
};

const ARGON_PRESETS = {
  light: { memoryCost: 2048, iterations: 2, parallelism: 1 },
  recommended: { memoryCost: 4096, iterations: 3, parallelism: 1 },
  robust: { memoryCost: 12288, iterations: 4, parallelism: 1 },
};

const loadPreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        bcryptOptions: BCRYPT_PRESETS.recommended,
        argonOptions: ARGON_PRESETS.recommended,
        bcryptPreset: "recommended",
        argonPreset: "recommended",
      };
    }
    const parsed = JSON.parse(raw);
    return {
      bcryptOptions: parsed.bcryptOptions || BCRYPT_PRESETS.recommended,
      argonOptions: parsed.argonOptions || ARGON_PRESETS.recommended,
      bcryptPreset: parsed.bcryptPreset || "recommended",
      argonPreset: parsed.argonPreset || "recommended",
    };
  } catch {
    return {
      bcryptOptions: BCRYPT_PRESETS.recommended,
      argonOptions: ARGON_PRESETS.recommended,
      bcryptPreset: "recommended",
      argonPreset: "recommended",
    };
  }
};

const HashGenerator = () => {
  const [initialPreferences] = useState(loadPreferences);

  // --- 2. ESTADO CENTRALIZADO Y MÁS LIMPIO ---
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState("bcrypt");

  // Opciones agrupadas por algoritmo para un estado más limpio y escalable.
  const [bcryptOptions, setBcryptOptions] = useState(initialPreferences.bcryptOptions);
  const [argonOptions, setArgonOptions] = useState(initialPreferences.argonOptions);
  const [bcryptPreset, setBcryptPreset] = useState(initialPreferences.bcryptPreset);
  const [argonPreset, setArgonPreset] = useState(initialPreferences.argonPreset);

  const [result, setResult] = useState({
    hash: "",
    isLoading: false,
    hasError: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const showToast = useToast();
  const { t } = useI18n();

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ bcryptOptions, argonOptions, bcryptPreset, argonPreset })
    );
  }, [bcryptOptions, argonOptions, bcryptPreset, argonPreset]);

  const setBcryptPresetByKey = (presetKey) => {
    const nextOptions = BCRYPT_PRESETS[presetKey];
    if (!nextOptions) return;
    setBcryptPreset(presetKey);
    setBcryptOptions(nextOptions);
  };

  const setArgonPresetByKey = (presetKey) => {
    const nextOptions = ARGON_PRESETS[presetKey];
    if (!nextOptions) return;
    setArgonPreset(presetKey);
    setArgonOptions(nextOptions);
  };

  const restoreDefaults = () => {
    setBcryptPresetByKey("recommended");
    setArgonPresetByKey("recommended");
  };

  const mapErrorToMessage = (error) => {
    switch (error?.code) {
      case ERROR_CODES.REQUIRED_PASSWORD:
        return t("messages.requiredPassword");
      case ERROR_CODES.PASSWORD_TOO_LONG:
        return t("messages.passwordTooLong", {
          max: SECURITY_LIMITS.password.maxLength,
        });
      case ERROR_CODES.UNSUPPORTED_ALGORITHM:
        return t("messages.unsupportedAlgorithm");
      case ERROR_CODES.HASH_GENERATION_FAILED:
        return t("messages.hashGenerationFailed");
      default:
        return t("messages.genericError", { message: error?.message ?? "unknown" });
    }
  };

  // --- 3. LÓGICA DE MANEJO DE EVENTOS (HANDLERS) ---

  /**
   * Maneja la generación del hash. La lógica compleja ahora está delegada.
   */
  const handleGenerateHash = async () => {
    if (!password) {
      showToast(t("messages.requiredPassword"), "warning");
      return;
    }

    setResult({ hash: t("hashGenerator.loading"), isLoading: true, hasError: false });

    try {
      // Un solo objeto de opciones que se pasa a la función de utilidad.
      const options = {
        password,
        algorithm,
        ...bcryptOptions,
        ...argonOptions,
      };
      const generatedHash = await generateHashWithOptions(options);
      setResult({ hash: generatedHash, isLoading: false, hasError: false });
    } catch (error) {
      console.error("Error al generar hash:", error); // Loguear el error real para depuración
      showToast(mapErrorToMessage(error), "error");
      setResult({
        hash: mapErrorToMessage(error),
        isLoading: false,
        hasError: true,
      });
    }
  };

  /**
   * Maneja el copiado al portapapeles.
   */
  const handleCopyToClipboard = async () => {
    if (!result.hash || result.isLoading || result.hasError) {
      showToast(t("messages.invalidHashToCopy"), "warning");
      return;
    }
    try {
      await navigator.clipboard.writeText(result.hash);
      showToast(t("messages.hashCopied"), "success");
    } catch {
      showToast(t("messages.hashCopyError"), "error");
    }
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
          <>
            <div className="input-group">
              <label htmlFor="bcryptPreset">{t("hashGenerator.presetLabel")}</label>
              <select
                id="bcryptPreset"
                value={bcryptPreset}
                onChange={(e) => setBcryptPresetByKey(e.target.value)}
                disabled={result.isLoading}
              >
                <option value="basic">{t("hashGenerator.presets.basic")}</option>
                <option value="recommended">
                  {t("hashGenerator.presets.recommended")}
                </option>
                <option value="high">{t("hashGenerator.presets.high")}</option>
                <option value="custom">{t("hashGenerator.presets.custom")}</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="rounds">{t("hashGenerator.rounds")}</label>
              <input
                type="number"
                id="rounds"
                value={bcryptOptions.rounds}
                min="4"
                max="15"
                onChange={(e) => {
                  setBcryptPreset("custom");
                  setBcryptOptions({
                    ...bcryptOptions,
                    rounds: Number.parseInt(e.target.value, 10) || 10,
                  });
                }}
                disabled={result.isLoading}
              />
              <div className="rounds-info">{t("hashGenerator.roundsHint")}</div>
            </div>
          </>
        );
      case "argon2":
        return (
          <>
            <div className="input-group">
              <label htmlFor="argonPreset">{t("hashGenerator.presetLabel")}</label>
              <select
                id="argonPreset"
                value={argonPreset}
                onChange={(e) => setArgonPresetByKey(e.target.value)}
                disabled={result.isLoading}
              >
                <option value="light">{t("hashGenerator.presets.light")}</option>
                <option value="recommended">
                  {t("hashGenerator.presets.recommended")}
                </option>
                <option value="robust">{t("hashGenerator.presets.robust")}</option>
                <option value="custom">{t("hashGenerator.presets.custom")}</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="memoryCost">{t("hashGenerator.memoryCost")}</label>
              <input
                type="number"
                id="memoryCost"
                value={argonOptions.memoryCost}
                min="1024"
                max="65536"
                onChange={(e) =>
                  setArgonOptions({
                    ...argonOptions,
                    memoryCost: Number.parseInt(e.target.value, 10) || 4096,
                  })
                }
                onInput={() => setArgonPreset("custom")}
                disabled={result.isLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="iterations">{t("hashGenerator.iterations")}</label>
              <input
                type="number"
                id="iterations"
                value={argonOptions.iterations}
                min="1"
                max="10"
                onChange={(e) =>
                  setArgonOptions({
                    ...argonOptions,
                    iterations: Number.parseInt(e.target.value, 10) || 3,
                  })
                }
                onInput={() => setArgonPreset("custom")}
                disabled={result.isLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="parallelism">{t("hashGenerator.parallelism")}</label>
              <input
                type="number"
                id="parallelism"
                value={argonOptions.parallelism}
                min="1"
                max="4"
                onChange={(e) =>
                  setArgonOptions({
                    ...argonOptions,
                    parallelism: Number.parseInt(e.target.value, 10) || 1,
                  })
                }
                onInput={() => setArgonPreset("custom")}
                disabled={result.isLoading}
              />
            </div>
          </>
        );
      default:
        return null; // SHA no tiene opciones configurables
    }
  };

  // --- 5. JSX DEL COMPONENTE PRINCIPAL ---

  return (
    <section className="generator-section" aria-labelledby="hash-generator-title">
      <h2 id="hash-generator-title">{t("hashGenerator.title")}</h2>
      <p className="subtitle">{t("hashGenerator.subtitle")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateHash();
        }}
      >
        {/* Selector de Algoritmo */}
        <div className="input-group">
          <label htmlFor="algorithm">{t("hashGenerator.algorithm")}</label>
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
          <label htmlFor="hash-password">{t("hashGenerator.password")}</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="hash-password"
              placeholder={t("hashGenerator.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={result.isLoading}
              maxLength={SECURITY_LIMITS.password.maxLength}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? t("hashGenerator.hidePassword")
                  : t("hashGenerator.showPassword")
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
        <button className="generate-btn" type="submit" disabled={result.isLoading}>
          {result.isLoading ? (
            <>
              <span className="spinner"></span>
              <span role="status" aria-live="polite">
                {t("hashGenerator.loading")}
              </span>
            </>
          ) : (
            t("hashGenerator.generate")
          )}
        </button>
        <button
          className="secondary-btn"
          type="button"
          onClick={restoreDefaults}
          disabled={result.isLoading}
        >
          {t("hashGenerator.restoreDefaults")}
        </button>
      </form>

      {/* Sección de Resultado */}
      <div className="result-section">
        <div className="result-label">{t("common.generatedHash")}</div>
        <div className="hash-display" role="status" aria-live="polite">
          {result.hash}
        </div>
        <button className="copy-btn" onClick={handleCopyToClipboard}>
          {t("common.copyHash")}
        </button>
      </div>
    </section>
  );
};

export default HashGenerator;
