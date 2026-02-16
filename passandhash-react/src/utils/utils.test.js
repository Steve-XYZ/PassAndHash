import { describe, expect, it, vi } from "vitest";
import {
  ERROR_CODES,
  generateHashWithOptions,
  verifyHashWithOptions,
} from "./utils.js";
import bcrypt from "bcryptjs";
import argon2 from "../lib/argon2.js";

vi.mock("bcryptjs", () => ({
  default: {
    genSalt: vi.fn(async (rounds) => `salt-${rounds}`),
    hash: vi.fn(async (password, salt) => `bcrypt:${password}:${salt}`),
    compare: vi.fn(async (password, hash) => hash === `bcrypt:${password}:salt-10`),
  },
}));

vi.mock("../lib/argon2.js", () => ({
  default: {
    ArgonType: { Argon2id: 2 },
    hash: vi.fn(async () => ({ encoded: "argon2-encoded" })),
    verify: vi.fn(
      async ({ pass, encoded }) => pass === "ok" && encoded === "argon2-encoded"
    ),
  },
}));

describe("generateHashWithOptions", () => {
  it("genera hash bcrypt con rounds saneados", async () => {
    const hash = await generateHashWithOptions({
      algorithm: "bcrypt",
      password: "secret",
      rounds: 2,
    });

    expect(hash).toBe("bcrypt:secret:salt-4");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(4);
  });

  it("genera hash argon2 con salida encoded", async () => {
    const hash = await generateHashWithOptions({
      algorithm: "argon2",
      password: "secret",
      memoryCost: 100000,
      iterations: 0,
      parallelism: 99,
    });

    expect(hash).toBe("argon2-encoded");
    expect(argon2.hash).toHaveBeenCalledOnce();
  });

  it("genera hash sha256 determinístico", async () => {
    const hash = await generateHashWithOptions({
      algorithm: "sha256",
      password: "abc",
    });

    expect(hash).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });

  it("falla si la contraseña está vacía", async () => {
    await expect(
      generateHashWithOptions({
        algorithm: "sha256",
        password: "",
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.REQUIRED_PASSWORD });
  });

  it("falla si el algoritmo no existe", async () => {
    await expect(
      generateHashWithOptions({
        algorithm: "md5",
        password: "secret",
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.UNSUPPORTED_ALGORITHM });
  });
});

describe("verifyHashWithOptions", () => {
  it("verifica bcrypt", async () => {
    await expect(
      verifyHashWithOptions({
        algorithm: "bcrypt",
        password: "secret",
        hash: "bcrypt:secret:salt-10",
      })
    ).resolves.toBe(true);
  });

  it("verifica argon2", async () => {
    await expect(
      verifyHashWithOptions({
        algorithm: "argon2",
        password: "ok",
        hash: "argon2-encoded",
      })
    ).resolves.toBe(true);
  });

  it("verifica sha512 por comparación de hash", async () => {
    const hash = await generateHashWithOptions({
      algorithm: "sha512",
      password: "secret",
    });

    await expect(
      verifyHashWithOptions({
        algorithm: "sha512",
        password: "secret",
        hash,
      })
    ).resolves.toBe(true);
  });

  it("falla si el hash está vacío", async () => {
    await expect(
      verifyHashWithOptions({
        algorithm: "sha256",
        password: "abc",
        hash: "",
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.REQUIRED_HASH });
  });

  it("falla si la contraseña excede límite de seguridad", async () => {
    await expect(
      verifyHashWithOptions({
        algorithm: "sha256",
        password: "a".repeat(2000),
        hash: "abc",
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.PASSWORD_TOO_LONG });
  });
});
