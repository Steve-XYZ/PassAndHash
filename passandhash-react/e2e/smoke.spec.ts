import { expect, test } from "@playwright/test";

test("home smoke flow works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "PassAndHash" })).toBeVisible();

  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expect(page.getByRole("heading", { name: "🔐 Hash Generator" })).toBeVisible();

  const hashGeneratorSection = page
    .getByRole("region", { name: "🔐 Hash Generator" })
    .first();

  await hashGeneratorSection.getByLabel("Password:").fill("hello");
  await hashGeneratorSection.getByRole("button", { name: "Generate Hash" }).click();
  await expect(page.getByText("✅ Generated hash:")).toBeVisible();
});
