import { test, expect } from "@playwright/test";

test("nagłówek w headerze to 'HEALTH RECO'", async ({ page }) => {
  const header = await page.getByRole("link", { name: "HEALTH RECO" });
  await expect(header).toContainText("HEALTH RECO");
});

test.describe("register test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("użytkownik może się zarejestrować", async ({ page }) => {
    await page.getByRole("link", { name: /zaloguj się/i }).click();
    await expect(
      page.getByRole("link", { name: /Stwórz je tutaj/i })
    ).toBeVisible();
    await page.getByRole("link", { name: /stwórz je tutaj/i }).click();
    await page.getByLabel(/imię/i).fill("Jan");
    await page.getByLabel(/nazwisko/i).fill("Kowalski");
    await page.getByLabel(/email/i).fill("jankowalski@test.com");
    await page.getByLabel("Hasło", { exact: true }).fill("WSx2ntNFh567yhB");
    await page
      .getByLabel("Powtórz hasło", { exact: true })
      .fill("WSx2ntNFh567yhB");

    await expect(
      page.getByRole("button", { name: /Stwórz konto/i })
    ).toBeVisible();
    await page.getByRole("button", { name: /Stwórz konto/i }).click();
    await expect(
      page.getByRole("button", { name: /Wyloguj się/i })
    ).toBeVisible();
  });
});

test.describe("Login/logout test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("użytkownik może się zalogować/wylogować", async ({ page }) => {
    await page.getByRole("link", { name: /zaloguj się/i }).click();
    await page.getByLabel(/email/i).fill("jannowak@test.com");
    await page.getByLabel(/hasło/i).fill("QHx2ntNFhgs932B");
    await page.getByRole("button", { name: /zaloguj się/i }).click();
    await expect(
      page.getByRole("button", { name: /Wyloguj się/i })
    ).toBeVisible();
    await page.getByRole("button", { name: /Wyloguj się/i }).click();
    await expect(
      page.getByRole("link", { name: /Zaloguj się/i })
    ).toBeVisible();
  });
});

test.describe("Blood recommendations with login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });
  test("użytkownik może sprawdzić swoje wyniki krwi i rekomendacje", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /zaloguj się/i }).click();
    await page.getByLabel(/email/i).fill("jannowak@test.com");
    await page.getByLabel(/hasło/i).fill("QHx2ntNFhgs932B");
    await page.getByRole("button", { name: /zaloguj się/i }).click();
    await expect(
      page.getByRole("link", { name: /Moje wyniki krwi/i })
    ).toBeVisible();
    await page.getByRole("link", { name: /Moje wyniki krwi/i }).click();
    await expect(
      page.getByRole("heading", { name: /Twój profil — wyniki krwi/i })
    ).toBeVisible();
    const firstRow = page.locator("table >> tbody >> tr").first();
    const rekomendacjaButton = firstRow
      .locator("button", { hasText: "Rekomendacja" })
      .first();
    await rekomendacjaButton.click();
    await expect(
      page.getByRole("button", { name: /Ukryj rekomendację/i })
    ).toBeVisible();
  });
});

test.describe("Input blood details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });
  test("użytkownik może wprowadzić swoje wyniki krwi", async ({ page }) => {
    await page.getByRole("link", { name: /zaloguj się/i }).click();
    await page.getByLabel(/email/i).fill("jankowalski@test.com");
    await page.getByLabel(/hasło/i).fill("WSx2ntNFh567yhB");
    await page.getByRole("button", { name: /zaloguj się/i }).click();
    await expect(
      page.getByRole("link", { name: /Moje wyniki krwi/i })
    ).toBeVisible();
    await page.getByRole("link", { name: /Moje wyniki krwi/i }).click();
    await expect(
      page.getByRole("heading", { name: /Twój profil — wyniki krwi/i })
    ).toBeVisible();
    await page.getByLabel(/data/i).fill("2025-12-14");
    await page.getByLabel(/wbc \(10\^9\/L\)/i).fill("6.2");
    await page.getByLabel(/hemoglobina \(g\/dL\)/i).fill("14.5");
    await page.getByLabel(/płytki \(10\^9\/L\)/i).fill("250");
    await page.getByLabel(/glukoza \(mg\/dL\)/i).fill("90");
    await page.getByLabel(/cholesterol \(mg\/dL\)/i).fill("180");
    await page.getByRole("button", { name: /Zapisz wynik/i }).click();
    await expect(page.getByText(/Wynik zapisany pomyślnie/i)).toBeVisible();
  });
});
