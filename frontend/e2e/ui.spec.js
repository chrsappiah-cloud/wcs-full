import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const API = process.env.PLAYWRIGHT_API_BASE || "http://localhost:3001";

test.describe("World Class Scholars UI", () => {
  test("home hero buttons and links", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page.getByRole("heading", { name: /World Class Scholars/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /iOS apps/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Search the library/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /About Christopher/i })).toBeVisible();
  });

  test("header nav — all primary routes", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(`${BASE}/`);

    await nav.getByRole("link", { name: "Library" }).click();
    await expect(page).toHaveURL(/\/library/);

    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about/);

    await nav.getByRole("link", { name: "Courses" }).click();
    await expect(page).toHaveURL(/\/courses/);

    await nav.getByRole("link", { name: "Digital Marketing" }).click();
    await expect(page).toHaveURL(/\/digital-marketing/);

    await nav.getByRole("link", { name: "Digital Advertising" }).click();
    await expect(page).toHaveURL(/\/digital-advertising/);

    await nav.getByRole("link", { name: "Apps & Store", exact: true }).click();
    await expect(page).toHaveURL(/\/marketing/);
  });

  test("legacy routes redirect to CodeAdx programs", async ({ page }) => {
    await page.goto(`${BASE}/future-lab`);
    await expect(page).toHaveURL(/\/digital-marketing/);
    await expect(page.getByRole("heading", { name: "Digital Marketing" })).toBeVisible();

    await page.goto(`${BASE}/art-verse`);
    await expect(page).toHaveURL(/\/digital-advertising/);
    await expect(page.getByRole("heading", { name: "Digital Advertising" })).toBeVisible();
  });

  test("home feature cards route correctly", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.getByRole("link", { name: /TestFlight betas/i }).click();
    await expect(page).toHaveURL(/tab=testflight/);

    await page.goto(`${BASE}/`);
    await page.getByRole("link", { name: /App Store purchases/i }).click();
    await expect(page).toHaveURL(/tab=app-store/);

    await page.goto(`${BASE}/`);
    await page.getByRole("link", { name: /Courses & micro-credentials/i }).click();
    await expect(page).toHaveURL(/\/courses/);
  });

  test("courses page loads from backend", async ({ page }) => {
    const apiDone = page.waitForResponse(
      (r) => r.url().includes("/api/v1/courses") && r.status() === 200
    );
    await page.goto(`${BASE}/courses`);
    await apiDone;
    await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible();
    await expect(page.locator("article.card").first()).toBeVisible();
    await expect(page.getByText(/Could not load courses/)).toHaveCount(0);
  });

  test("about page loads founder from backend", async ({ page }) => {
    const apiDone = page.waitForResponse(
      (r) => r.url().includes("/api/v1/about") && r.status() === 200
    );
    await page.goto(`${BASE}/about`);
    await apiDone;
    await expect(page.getByRole("heading", { name: /Christopher Appiah-Thompson/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /chrsappiah@gmail.com/i })).toBeVisible();
  });

  test("digital marketing — promotional images and creative links", async ({ page }) => {
    await page.goto(`${BASE}/digital-marketing`);
    await expect(page.getByRole("heading", { name: "Digital Marketing" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Promotional showcase" })).toBeVisible();
    await expect(page.locator(".promo-card-image").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Gumroad Art Works/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /NightCafe/i })).toBeVisible();
    await page.getByRole("link", { name: "Digital advertising" }).click();
    await expect(page).toHaveURL(/\/digital-advertising/);
  });

  test("digital advertising — podcaster dashboard link", async ({ page }) => {
    await page.goto(`${BASE}/digital-advertising`);
    await expect(page.getByRole("heading", { name: "Digital Advertising" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Launch podcaster stats/i })).toHaveAttribute(
      "href",
      /app\.codeadx\.com\/podcaster\/stats/
    );
  });

  test("marketing portal — all three tabs", async ({ page }) => {
    await page.goto(`${BASE}/marketing`);

    const appsTab = page.getByRole("button", { name: "Apps & referrals" });
    const testflightTab = page.getByRole("button", { name: "TestFlight beta" });
    const appStoreTab = page.getByRole("button", { name: "App Store purchase" });

    await expect(appsTab).toBeVisible();
    await expect(page.getByRole("heading", { name: /Promotional iOS apps/i })).toBeVisible();

    await testflightTab.click();
    await expect(page).toHaveURL(/tab=testflight/);
    await expect(page.getByRole("heading", { name: /Download TestFlight beta data/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Download beta manifest/i })).toBeVisible();

    await appStoreTab.click();
    await expect(page).toHaveURL(/tab=app-store/);
    await expect(page.getByRole("heading", { name: /Purchase through the App Store/i })).toBeVisible();
    await expect(page.getByText(/StoreKit products/i)).toBeVisible();

    await appsTab.click();
    await expect(page.getByRole("link", { name: "Referral kit" }).first()).toBeVisible();
  });

  test("marketing app store tab loads commerce from backend", async ({ page }) => {
    const commerce = page.waitForResponse(
      (r) => r.url().includes("/api/v1/commerce/apple") && r.status() === 200
    );
    await page.goto(`${BASE}/marketing?tab=app-store`);
    await commerce;
    await expect(page.getByText(/wcs_premium_monthly|WCS Premium/i)).toBeVisible();
  });

  test("marketing app detail — referral kit and copy", async ({ page }) => {
    await page.goto(`${BASE}/marketing`);
    await page
      .getByRole("article")
      .filter({ hasText: "WCS Gold Test" })
      .getByRole("link", { name: "Referral kit" })
      .click();
    await expect(page).toHaveURL(/\/marketing\/wcs-goldtest/);
    await expect(page.getByRole("heading", { level: 2, name: "WCS Gold Test" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Join TestFlight" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy" }).first()).toBeVisible();
  });

  test("library search returns backend results", async ({ page }) => {
    const searchDone = page.waitForResponse(
      (r) => r.url().includes("/api/v1/library/search") && r.status() === 200
    );
    await page.goto(`${BASE}/library`);
    await page.getByRole("button", { name: "Search" }).click();
    await searchDone;
    await expect(page.getByText(/Could not load|Search failed/).first()).toHaveCount(0);
  });

  test("home featured resources load from backend", async ({ page }) => {
    const featured = page.waitForResponse(
      (r) => r.url().includes("/api/v1/resources/featured") && r.status() === 200
    );
    await page.goto(`${BASE}/`);
    await featured;
    const firstResource = page.locator(".result-link").first();
    await expect(firstResource).toBeVisible();
    await firstResource.click();
    await expect(page).toHaveURL(/\/resources\//);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("account access page after sign-in", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByLabel("Email").fill("admin@myworldclass.org");
    await page.getByLabel("Password").fill("admin123");
    const login = page.waitForResponse(
      (r) => r.url().includes("/api/v1/auth/login") && r.status() === 200
    );
    await page.getByRole("button", { name: /^Sign in$/i }).click();
    await login;
    await page.getByRole("link", { name: "My Access" }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole("heading", { name: "My access" })).toBeVisible();
    await expect(page.getByText("WCS Premium Monthly")).toBeVisible({ timeout: 10_000 });
  });

  test("contact form and support emails visible", async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await expect(page.getByRole("heading", { name: "Feedback & enquiries" })).toBeVisible();
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "support@myworldclass.org" }).first()).toBeVisible();
    await expect(main.getByRole("link", { name: "admin@myworldclass.org" }).first()).toBeVisible();
    await page.getByLabel("Your name", { exact: false }).fill("Public User");
    await page.locator('input[type="email"]').fill("public@example.com");
    await page.locator("textarea").fill("This is a test enquiry from Playwright.");
    const submit = page.waitForResponse(
      (r) => r.url().includes("/api/v1/contact") && r.request().method() === "POST" && r.status() === 201
    );
    await page.getByRole("button", { name: "Send message" }).click();
    await submit;
    await expect(page.getByText(/message has been received/i)).toBeVisible({ timeout: 8000 });
  });

  test("admin analytics dashboard with world map", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByLabel("Email").fill("admin@myworldclass.org");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: /^Sign in$/i }).click();
    await page.goto(`${BASE}/admin/analytics`);
    await expect(page).toHaveURL(/\/admin\/analytics/);
    await expect(page.getByRole("heading", { name: "User analytics" })).toBeVisible();
    await expect(page.locator(".world-map")).toBeVisible();
    await expect(page.getByText("Visitors on the world map")).toBeVisible();
  });

  test("admin access management page", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByLabel("Email").fill("admin@myworldclass.org");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: /^Sign in$/i }).click();
    await page.locator('a.admin-link[href="/admin/access"]').click();
    await expect(page).toHaveURL(/\/admin\/access/);
    await expect(page.getByRole("heading", { name: "Access & payments" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Grant product" })).toBeVisible();
  });

  test("login form buttons and admin sign-in", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.getByRole("button", { name: /Sign in|Create account/i })).toBeVisible();
    await page.getByRole("button", { name: "Create one" }).click();
    await expect(page.getByRole("button", { name: /Create account/i })).toBeVisible();

    await page.getByRole("button", { name: /Sign in/i }).click();
    await page.getByLabel("Email").fill("admin@myworldclass.org");
    await page.getByLabel("Password").fill("admin123");
    const login = page.waitForResponse(
      (r) => r.url().includes("/api/v1/auth/login") && r.status() === 200
    );
    await page.getByRole("button", { name: /^Sign in$/i }).click();
    await login;
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible({ timeout: 10_000 });
  });

  test("theme toggle in header", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const themeBtn = page.getByRole("button", { name: "Switch theme" });
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    const theme = await page.locator("html").getAttribute("data-theme");
    expect(["dark", "light"]).toContain(theme);
  });

  test("footer explore and connect links", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Digital Marketing" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Digital Advertising" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "TestFlight beta data" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "App Store purchase", exact: true })).toBeVisible();
  });
});

test.describe("Backend health (direct)", () => {
  test("API health and platform nav include new programs", async ({ request }) => {
    const health = await request.get(`${API}/health`);
    expect(health.ok()).toBeTruthy();

    const platform = await request.get(`${API}/api/v1/platform`);
    expect(platform.ok()).toBeTruthy();
    const body = await platform.json();
    const paths = body.nav.map((n) => n.to);
    expect(paths).toContain("/digital-marketing");
    expect(paths).toContain("/digital-advertising");
    expect(paths).not.toContain("/future-lab");
    expect(paths).not.toContain("/art-verse");
  });
});
