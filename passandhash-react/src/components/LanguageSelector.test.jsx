import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSelector from "./LanguageSelector";
import { LanguageProvider } from "../contexts/LanguageProvider";

describe("LanguageSelector", () => {
  beforeEach(() => {
    localStorage.removeItem("language");
    document.documentElement.lang = "es";
  });

  it("usa español por defecto y permite cambiar a inglés", async () => {
    render(
      <LanguageProvider>
        <LanguageSelector />
      </LanguageProvider>
    );
    const user = userEvent.setup();

    expect(screen.getByLabelText("Idioma")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Idioma"), "en");

    await waitFor(() => {
      expect(localStorage.getItem("language")).toBe("en");
      expect(document.documentElement.lang).toBe("en");
      expect(screen.getByLabelText("Language")).toBeInTheDocument();
    });
  });
});
