import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HashCracker from "./HashCracker";

const showToast = vi.fn();

vi.mock("../hooks/useToast", () => ({
  useToast: () => showToast,
}));

vi.mock("../data/common-passwords.js", () => ({
  COMMON_PASSWORDS: ["password", "123456", "qwerty"],
}));

vi.mock("../utils/utils.js", () => ({
  SECURITY_LIMITS: {
    password: { maxLength: 1024 },
    hash: { maxLength: 4096 },
  },
  ERROR_CODES: {
    REQUIRED_HASH: "REQUIRED_HASH",
    HASH_TOO_LONG: "HASH_TOO_LONG",
    UNSUPPORTED_ALGORITHM: "UNSUPPORTED_ALGORITHM",
    HASH_VERIFICATION_FAILED: "HASH_VERIFICATION_FAILED",
  },
  verifyHashWithOptions: vi.fn(async ({ password }) => {
    return password === "123456";
  }),
}));

describe("HashCracker", () => {
  it("renderiza titulo y los 4 algoritmos", () => {
    render(<HashCracker />);

    expect(
      screen.getByRole("heading", { name: /descifrador de hash/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "bcrypt" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Argon2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "SHA-256" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "SHA-512" })).toBeInTheDocument();
  });

  it("valida que el hash sea obligatorio", async () => {
    render(<HashCracker />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: /iniciar ataque de diccionario/i })
    );

    expect(showToast).toHaveBeenCalledWith(
      "Por favor ingresa un hash",
      "warning"
    );
  });

  it("muestra la contrasena encontrada cuando hay match", async () => {
    render(<HashCracker />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Hash:"), "somehash");
    await user.click(
      screen.getByRole("button", { name: /iniciar ataque de diccionario/i })
    );

    const result = await screen.findByText(/123456/);
    expect(result).toBeInTheDocument();
  });

  it("checkbox de fuerza bruta deshabilitado para bcrypt", () => {
    render(<HashCracker />);

    const checkbox = screen.getByLabelText(/fuerza bruta/i);
    expect(checkbox).toBeDisabled();
  });

  it("checkbox de fuerza bruta habilitado para SHA-256", async () => {
    render(<HashCracker />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Algoritmo:"), "sha256");

    const checkbox = screen.getByLabelText(/fuerza bruta/i);
    expect(checkbox).not.toBeDisabled();
  });
});
