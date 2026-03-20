import { useEffect, useRef, useState } from "react";
import {
  ERROR_CODES,
  SECURITY_LIMITS,
  verifyHashWithOptions,
} from "../utils/utils.js";
import { COMMON_PASSWORDS } from "../data/common-passwords.js";
import { useToast } from "../hooks/useToast";
import { useI18n } from "../hooks/useI18n";

const BRUTE_FORCE_CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const BRUTE_FORCE_MAX_LENGTH = 4;

const countBruteForceTotal = () => {
  const base = BRUTE_FORCE_CHARSET.length;
  let total = 0;
  for (let len = 1; len <= BRUTE_FORCE_MAX_LENGTH; len++) {
    total += base ** len;
  }
  return total;
};

function* bruteForceGenerator() {
  const chars = BRUTE_FORCE_CHARSET;
  for (let len = 1; len <= BRUTE_FORCE_MAX_LENGTH; len++) {
    const indices = new Array(len).fill(0);
    const total = chars.length ** len;
    for (let i = 0; i < total; i++) {
      let candidate = "";
      for (let j = 0; j < len; j++) {
        candidate += chars[indices[j]];
      }
      yield candidate;
      // Increment indices (like a counter in base chars.length)
      for (let j = len - 1; j >= 0; j--) {
        indices[j]++;
        if (indices[j] < chars.length) break;
        indices[j] = 0;
      }
    }
  }
}

const isShaAlgorithm = (algo) => algo === "sha256" || algo === "sha512";

const HashCracker = () => {
  const [hash, setHash] = useState("");
  const [algorithm, setAlgorithm] = useState("bcrypt");
  const [bruteForce, setBruteForce] = useState(false);
  const [result, setResult] = useState({ status: "idle", message: "" });
  const [isCracking, setIsCracking] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: "" });
  const cancelRef = useRef(false);
  const showToast = useToast();
  const { t } = useI18n();

  useEffect(() => {
    setResult((prev) =>
      prev.status === "idle"
        ? { status: "idle", message: t("hashCracker.idle") }
        : prev
    );
  }, [t]);

  // Disable brute force when switching to a non-SHA algorithm
  useEffect(() => {
    if (!isShaAlgorithm(algorithm)) {
      setBruteForce(false);
    }
  }, [algorithm]);

  const mapErrorToMessage = (error) => {
    switch (error?.code) {
      case ERROR_CODES.REQUIRED_HASH:
        return t("messages.requiredHash");
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

  const handleCrack = async () => {
    if (!hash) {
      showToast(t("messages.requiredHash"), "warning");
      return;
    }

    setIsCracking(true);
    cancelRef.current = false;

    const dictionaryTotal = COMMON_PASSWORDS.length;
    const bruteTotal = bruteForce ? countBruteForceTotal() : 0;
    const grandTotal = dictionaryTotal + bruteTotal;

    setResult({ status: "cracking", message: t("hashCracker.loading") });
    setProgress({ current: 0, total: grandTotal, phase: t("hashCracker.phaseDictionary") });

    try {
      // Phase 1: Dictionary attack
      for (let i = 0; i < COMMON_PASSWORDS.length; i++) {
        if (cancelRef.current) {
          setResult({ status: "cancelled", message: t("hashCracker.cancelled") });
          return;
        }

        setProgress({
          current: i + 1,
          total: grandTotal,
          phase: t("hashCracker.phaseDictionary"),
        });

        const candidate = COMMON_PASSWORDS[i];
        const match = await verifyHashWithOptions({
          algorithm,
          password: candidate,
          hash,
        });

        if (match) {
          setResult({
            status: "match",
            message: t("hashCracker.match", { password: candidate }),
          });
          return;
        }

        await new Promise((r) => setTimeout(r, 0));
      }

      // Phase 2: Brute force (SHA only)
      if (bruteForce) {
        setProgress({
          current: dictionaryTotal,
          total: grandTotal,
          phase: t("hashCracker.phaseBruteForce"),
        });

        let bruteCount = 0;
        const gen = bruteForceGenerator();

        for (const candidate of gen) {
          if (cancelRef.current) {
            setResult({ status: "cancelled", message: t("hashCracker.cancelled") });
            return;
          }

          bruteCount++;

          const match = await verifyHashWithOptions({
            algorithm,
            password: candidate,
            hash,
          });

          if (match) {
            setResult({
              status: "match",
              message: t("hashCracker.match", { password: candidate }),
            });
            return;
          }

          // Yield to UI every 500 iterations (SHA is fast)
          if (bruteCount % 500 === 0) {
            setProgress({
              current: dictionaryTotal + bruteCount,
              total: grandTotal,
              phase: t("hashCracker.phaseBruteForce"),
            });
            await new Promise((r) => setTimeout(r, 0));
          }
        }
      }

      setResult({ status: "mismatch", message: t("hashCracker.mismatch") });
    } catch (error) {
      console.error("Error al descifrar:", error);
      showToast(mapErrorToMessage(error), "error");
      setResult({ status: "error", message: mapErrorToMessage(error) });
    } finally {
      setIsCracking(false);
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
  };

  const shaSelected = isShaAlgorithm(algorithm);

  return (
    <section className="generator-section" aria-labelledby="hash-cracker-title">
      <h2 id="hash-cracker-title">{t("hashCracker.title")}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCrack();
        }}
      >
        <div className="input-group">
          <label htmlFor="crack-algorithm">{t("hashCracker.algorithm")}</label>
          <select
            id="crack-algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isCracking}
          >
            <option value="bcrypt">bcrypt</option>
            <option value="argon2">Argon2</option>
            <option value="sha256">SHA-256</option>
            <option value="sha512">SHA-512</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="crack-hash">{t("hashCracker.hash")}</label>
          <input
            type="text"
            id="crack-hash"
            placeholder={t("hashCracker.hashPlaceholder")}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            disabled={isCracking}
            maxLength={SECURITY_LIMITS.hash.maxLength}
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="bruteForce"
            checked={bruteForce}
            onChange={(e) => setBruteForce(e.target.checked)}
            disabled={isCracking || !shaSelected}
          />
          <label htmlFor="bruteForce">
            {t("hashCracker.bruteForceLabel")}
          </label>
        </div>
        {!shaSelected && (
          <p className="rounds-info">{t("hashCracker.bruteForceDisabledHint")}</p>
        )}
        {isCracking ? (
          <button
            type="button"
            className="generate-btn cancel-btn"
            onClick={handleCancel}
          >
            {t("hashCracker.cancel")}
          </button>
        ) : (
          <button className="generate-btn" type="submit">
            {t("hashCracker.crack")}
          </button>
        )}
      </form>

      {isCracking && (
        <div className="progress-section">
          <div className="progress-label">{progress.phase}</div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
          <span className="progress-text">
            {t("hashCracker.progress", {
              current: progress.current,
              total: progress.total,
            })}
          </span>
        </div>
      )}

      <div className="result-section">
        <div className="result-label">{t("common.result")}</div>
        <div
          className={`hash-display result--${result.status}`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      </div>
      <p className="security-note">{t("hashCracker.securityNote")}</p>
    </section>
  );
};

export default HashCracker;
