import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HashGenerator from "./HashGenerator";

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
    PASSWORD_TOO_LONG: "PASSWORD_TOO_LONG",
    UNSUPPORTED_ALGORITHM: "UNSUPPORTED_ALGORITHM",
    HASH_GENERATION_FAILED: "HASH_GENERATION_FAILED",
  },
  generateHashWithOptions: vi.fn(async () => "hash-generado"),
}));

describe("HashGenerator", () => {
  it("permite usar presets y restaurar valores por defecto", async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Preset de seguridad:"), "high");
    const roundsInput = screen.getByLabelText("Rounds (complejidad):");
    expect(roundsInput).toHaveValue(12);

    await user.click(
      screen.getByRole("button", { name: /restaurar valores por defecto/i })
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Rounds (complejidad):")).toHaveValue(10);
    });
  });

  it("muestra los parámetros completos de Argon2", async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Algoritmo:"), "argon2");

    expect(screen.getByLabelText("Costo de Memoria (KiB):")).toBeInTheDocument();
    expect(screen.getByLabelText("Iteraciones:")).toBeInTheDocument();
    expect(screen.getByLabelText("Paralelismo:")).toBeInTheDocument();
  });

  it("muestra warning al copiar sin hash", async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /copiar hash/i }));

    expect(showToast).toHaveBeenCalledWith("No hay un hash válido para copiar", "warning");
  });

  it("genera y copia hash correctamente", async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    await user.type(screen.getByLabelText("Contraseña:"), "secreto");
    await user.click(screen.getByRole("button", { name: /^generar hash$/i }));

    await waitFor(() => {
      expect(screen.getByText("hash-generado")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /copiar hash/i }));
    expect(writeTextSpy).toHaveBeenCalledWith("hash-generado");
  });
});
