import bcrypt from "bcryptjs";
import argon2 from "../lib/argon2.js";

export const SECURITY_LIMITS = {
  password: {
    minLength: 1,
    maxLength: 1024,
  },
  hash: {
    minLength: 1,
    maxLength: 4096,
  },
} as const;

export const ERROR_CODES = {
  REQUIRED_PASSWORD: "REQUIRED_PASSWORD",
  REQUIRED_HASH: "REQUIRED_HASH",
  PASSWORD_TOO_LONG: "PASSWORD_TOO_LONG",
  HASH_TOO_LONG: "HASH_TOO_LONG",
  UNSUPPORTED_ALGORITHM: "UNSUPPORTED_ALGORITHM",
  HASH_GENERATION_FAILED: "HASH_GENERATION_FAILED",
  HASH_VERIFICATION_FAILED: "HASH_VERIFICATION_FAILED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type HashAlgorithm = "bcrypt" | "argon2" | "sha256" | "sha512";

export interface AppError extends Error {
  code: ErrorCode;
}

interface BaseOptions {
  password: string;
}

interface BcryptHashOptions extends BaseOptions {
  algorithm: "bcrypt";
  rounds?: number;
}

interface Argon2HashOptions extends BaseOptions {
  algorithm: "argon2";
  memoryCost?: number;
  iterations?: number;
  parallelism?: number;
}

interface ShaHashOptions extends BaseOptions {
  algorithm: "sha256" | "sha512";
}

export type GenerateHashOptions =
  | BcryptHashOptions
  | Argon2HashOptions
  | ShaHashOptions;

interface BaseVerifyOptions extends BaseOptions {
  hash: string;
}

interface BcryptVerifyOptions extends BaseVerifyOptions {
  algorithm: "bcrypt";
}

interface Argon2VerifyOptions extends BaseVerifyOptions {
  algorithm: "argon2";
}

interface ShaVerifyOptions extends BaseVerifyOptions {
  algorithm: "sha256" | "sha512";
}

export type VerifyHashOptions =
  | BcryptVerifyOptions
  | Argon2VerifyOptions
  | ShaVerifyOptions;

const createAppError = (code: ErrorCode, message: string): AppError => {
  const error = new Error(message) as AppError;
  error.code = code;
  return error;
};

const clampInteger = (
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number => {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
};

const sanitizePassword = (password: unknown): string => {
  const normalized =
    typeof password === "string" ? password : String(password ?? "");
  if (normalized.length < SECURITY_LIMITS.password.minLength) {
    throw createAppError(
      ERROR_CODES.REQUIRED_PASSWORD,
      "La contraseña es obligatoria"
    );
  }
  if (normalized.length > SECURITY_LIMITS.password.maxLength) {
    throw createAppError(
      ERROR_CODES.PASSWORD_TOO_LONG,
      "La contraseña excede el tamaño permitido"
    );
  }
  return normalized;
};

const sanitizeHash = (hash: unknown): string => {
  const normalized =
    typeof hash === "string" ? hash.trim() : String(hash ?? "").trim();
  if (normalized.length < SECURITY_LIMITS.hash.minLength) {
    throw createAppError(ERROR_CODES.REQUIRED_HASH, "El hash es obligatorio");
  }
  if (normalized.length > SECURITY_LIMITS.hash.maxLength) {
    throw createAppError(
      ERROR_CODES.HASH_TOO_LONG,
      "El hash excede el tamaño permitido"
    );
  }
  return normalized;
};

const sanitizeAlgorithm = (algorithm: unknown): HashAlgorithm => {
  const normalized = String(algorithm ?? "").toLowerCase();
  if (!["bcrypt", "argon2", "sha256", "sha512"].includes(normalized)) {
    throw createAppError(
      ERROR_CODES.UNSUPPORTED_ALGORITHM,
      "Algoritmo no soportado"
    );
  }
  return normalized as HashAlgorithm;
};

const toHex = (buffer: ArrayBuffer): string => {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const constantTimeStringEqual = (a: string, b: string): boolean => {
  const left = String(a);
  const right = String(b);
  const maxLength = Math.max(left.length, right.length);
  let result = left.length ^ right.length;

  for (let i = 0; i < maxLength; i += 1) {
    const leftCode = i < left.length ? left.charCodeAt(i) : 0;
    const rightCode = i < right.length ? right.charCodeAt(i) : 0;
    result |= leftCode ^ rightCode;
  }
  return result === 0;
};

export const generateHashWithOptions = async (
  options: GenerateHashOptions
): Promise<string> => {
  const algorithm = sanitizeAlgorithm(options?.algorithm);
  const password = sanitizePassword(options?.password);

  switch (algorithm) {
    case "bcrypt": {
      const safeRounds = clampInteger((options as BcryptHashOptions).rounds, 4, 15, 10);
      try {
        const salt = await bcrypt.genSalt(safeRounds);
        return bcrypt.hash(password, salt);
      } catch {
        throw createAppError(
          ERROR_CODES.HASH_GENERATION_FAILED,
          "No fue posible generar hash bcrypt"
        );
      }
    }

    case "argon2": {
      const argonOptions = options as Argon2HashOptions;
      const safeMemoryCost = clampInteger(argonOptions.memoryCost, 1024, 65536, 4096);
      const safeIterations = clampInteger(argonOptions.iterations, 1, 10, 3);
      const safeParallelism = clampInteger(argonOptions.parallelism, 1, 4, 1);
      try {
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
      } catch {
        throw createAppError(
          ERROR_CODES.HASH_GENERATION_FAILED,
          "No fue posible generar hash Argon2"
        );
      }
    }

    case "sha256":
    case "sha512": {
      try {
        const msgUint8 = new TextEncoder().encode(password);
        const algo = algorithm === "sha256" ? "SHA-256" : "SHA-512";
        const hashBuffer = await window.crypto.subtle.digest(algo, msgUint8);
        return toHex(hashBuffer);
      } catch {
        throw createAppError(
          ERROR_CODES.HASH_GENERATION_FAILED,
          "No fue posible generar hash SHA"
        );
      }
    }
  }
};

export const verifyHashWithOptions = async (
  options: VerifyHashOptions
): Promise<boolean> => {
  const algorithm = sanitizeAlgorithm(options?.algorithm);
  const password = sanitizePassword(options?.password);
  const hash = sanitizeHash(options?.hash);

  switch (algorithm) {
    case "bcrypt": {
      try {
        return bcrypt.compare(password, hash);
      } catch {
        throw createAppError(
          ERROR_CODES.HASH_VERIFICATION_FAILED,
          "No fue posible verificar hash bcrypt"
        );
      }
    }
    case "argon2": {
      try {
        return argon2.verify({ pass: password, encoded: hash });
      } catch {
        throw createAppError(
          ERROR_CODES.HASH_VERIFICATION_FAILED,
          "No fue posible verificar hash Argon2"
        );
      }
    }
    case "sha256":
    case "sha512": {
      const generatedHash = await generateHashWithOptions({
        algorithm,
        password,
      });
      return constantTimeStringEqual(
        generatedHash.toLowerCase(),
        hash.toLowerCase()
      );
    }
  }
};
