import { useEffect, useState } from "react";
// Importamos nuestra nueva función de utilidad
import {
  ERROR_CODES,
  SECURITY_LIMITS,
  verifyHashWithOptions,
} from "../utils/utils.js";
import { useToast } from "../hooks/useToast";
import { useI18n } from "../hooks/useI18n";

const HashVerifier = () => {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [algorithm, setAlgorithm] = useState("bcrypt");

  // 1. Estado de resultado mejorado: almacena un 'status' para estilizar la UI
  const [result, setResult] = useState({
    status: "idle",
    message: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const showToast = useToast();
  const { t } = useI18n();

  useEffect(() => {
    setResult((prev) =>
      prev.status === "idle"
        ? { status: "idle", message: t("hashVerifier.idle") }
        : prev
    );
  }, [t]);

  const mapErrorToMessage = (error) => {
    switch (error?.code) {
      case ERROR_CODES.REQUIRED_PASSWORD:
        return t("messages.requiredPassword");
      case ERROR_CODES.REQUIRED_HASH:
        return t("messages.requiredHash");
      case ERROR_CODES.PASSWORD_TOO_LONG:
        return t("messages.passwordTooLong", {
          max: SECURITY_LIMITS.password.maxLength,
        });
      case ERROR_CODES.HASH_TOO_LONG:
        return t("messages.hashTooLong", { max: SECURITY_LIMITS.hash.maxLength });
      case ERROR_CODES.UNSUPPORTED_ALGORITHM:
        return t("messages.unsupportedAlgorithm");
      case ERROR_CODES.HASH_VERIFICATION_FAILED:
        return t("messages.hashVerificationFailed");
      default:
        return t("messages.genericError", { message: error?.message ?? "unknown" });
    }
  };

  const handleVerifyHash = async () => {
    if (!password || !hash) {
      showToast(t("messages.requiredPasswordAndHash"), "warning");
      return;
    }

    setIsVerifying(true);
    setResult({ status: "verifying", message: t("hashVerifier.loading") });

    try {
      // 2. La lógica compleja ahora es una sola llamada a nuestra utilidad
      const options = { algorithm, password, hash };
      const match = await verifyHashWithOptions(options);

      // 3. Actualizamos el estado con un status semántico
      if (match) {
        setResult({
          status: "match",
          message: t("hashVerifier.match"),
        });
      } else {
        setResult({
          status: "mismatch",
          message: t("hashVerifier.mismatch"),
        });
      }
    } catch (error) {
      console.error("Error al verificar:", error);
      showToast(mapErrorToMessage(error), "error");
      setResult({
        status: "error",
        message: mapErrorToMessage(error),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="generator-section" aria-labelledby="hash-verifier-title">
      <h2 id="hash-verifier-title">{t("hashVerifier.title")}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyHash();
        }}
      >
        <div className="input-group">
          <label htmlFor="verify-algorithm">{t("hashVerifier.algorithm")}</label>
          <select
            id="verify-algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isVerifying}
          >
            <option value="bcrypt">bcrypt</option>
            <option value="argon2">Argon2</option>
            <option value="sha256">SHA-256</option>
            <option value="sha512">SHA-512</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="verify-password">{t("hashVerifier.plainPassword")}</label>
          <input
            type="password"
            id="verify-password"
            placeholder={t("hashVerifier.plainPasswordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isVerifying}
            maxLength={SECURITY_LIMITS.password.maxLength}
            autoComplete="current-password"
          />
        </div>
        <div className="input-group">
          <label htmlFor="verify-hash">{t("hashVerifier.hash")}</label>
          <input
            type="text"
            id="verify-hash"
            placeholder={t("hashVerifier.hashPlaceholder")}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            disabled={isVerifying}
            maxLength={SECURITY_LIMITS.hash.maxLength}
          />
        </div>
        <button className="generate-btn" type="submit" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <span className="spinner"></span>
              <span role="status" aria-live="polite">
                {t("hashVerifier.loading")}
              </span>
            </>
          ) : (
            t("hashVerifier.verify")
          )}
        </button>
      </form>
      <div className="result-section">
        <div className="result-label">{t("common.result")}</div>
        {/* 4. El display ahora tiene una clase dinámica basada en el status del resultado */}
        <div
          className={`hash-display result--${result.status}`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      </div>
    </section>
  );
};

export default HashVerifier;
