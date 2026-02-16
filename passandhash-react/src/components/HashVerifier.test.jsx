import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HashVerifier from "./HashVerifier";

const showToast = vi.fn();

vi.mock("../hooks/useToast", () => ({
  useToast: () => showToast,
}));

vi.mock("../utils/utils.js", () => ({
  SECURITY_LIMITS: {
    password: { maxLength: 1024 },
    hash: { maxLength: 4096 },
  },
  ERROR_CODES: {
    REQUIRED_PASSWORD: "REQUIRED_PASSWORD",
    REQUIRED_HASH: "REQUIRED_HASH",
    PASSWORD_TOO_LONG: "PASSWORD_TOO_LONG",
    HASH_TOO_LONG: "HASH_TOO_LONG",
    UNSUPPORTED_ALGORITHM: "UNSUPPORTED_ALGORITHM",
    HASH_VERIFICATION_FAILED: "HASH_VERIFICATION_FAILED",
  },
  verifyHashWithOptions: vi.fn(async ({ algorithm, password, hash }) => {
    return algorithm === "sha256" && password === "abc" && hash === "ok";
  }),
}));

describe("HashVerifier", () => {
  it("incluye algoritmos SHA para verificación", () => {
    render(<HashVerifier />);

    expect(screen.getByRole("option", { name: "SHA-256" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "SHA-512" })).toBeInTheDocument();
  });

  it("usa input password para texto plano", () => {
    render(<HashVerifier />);
    expect(screen.getByLabelText("Contraseña en texto plano:")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("valida campos obligatorios antes de verificar", async () => {
    render(<HashVerifier />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /verificar hash/i }));

    expect(showToast).toHaveBeenCalledWith(
      "Por favor ingresa la contraseña y el hash",
      "warning"
    );
  });
});
