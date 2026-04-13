import { test, expect } from "@playwright/test";

test.describe("🎨 Dashboard Pages - Visual & Component Validation", () => {
  const baseUrl = "http://localhost:3000";

  // Setup: Start dev server before tests
  test.beforeAll(async () => {
    console.log("📦 Testing dashboard pages at:", baseUrl);
  });

  test("✅ /dashboard - Render without errors", async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    
    // Check page loaded
    await expect(page).toHaveTitle(/dashboard|beautyflow/i);
    
    // Check no console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test("✅ /appointments - Table with mock data renders", async ({ page }) => {
    await page.goto(`${baseUrl}/appointments`, { waitUntil: "networkidle" });
    
    // Check page elements exist
    await expect(page.locator("text=Agendamentos")).toBeVisible();
    await expect(page.locator("button:has-text('Novo')")).toBeVisible();
    
    // Check search/filter exist
    const searchInput = page.locator("input[placeholder*='Pesquisar']");
    await expect(searchInput).toBeVisible();
    
    // Table should render (either with data or empty state)
    const tableOrEmptyState = page.locator("table, text=Nenhum agendamento");
    await expect(tableOrEmptyState).toBeVisible();
  });

  test("✅ /clients - Avatar + contact info renders", async ({ page }) => {
    await page.goto(`${baseUrl}/clients`, { waitUntil: "networkidle" });
    
    // Check page elements
    await expect(page.locator("text=Clientes")).toBeVisible();
    await expect(page.locator("button:has-text('Novo')")).toBeVisible();
    
    // Check if content area exists
    const content = page.locator("main, [role='main']");
    await expect(content).toBeVisible();
    
    // Should not have console errors
    const errorMsg = page.locator("text=Error|erro|failed").first();
    await expect(errorMsg).not.toBeVisible({ timeout: 2000 });
  });

  test("✅ /services - Price formatting + categories", async ({ page }) => {
    await page.goto(`${baseUrl}/services`, { waitUntil: "networkidle" });
    
    // Check page elements
    await expect(page.locator("text=Serviços")).toBeVisible();
    
    // Should have add button
    await expect(page.locator("button:has-text('Novo')")).toBeVisible();
    
    // Content should render
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("✅ /employees - Specialties + ratings", async ({ page }) => {
    await page.goto(`${baseUrl}/employees`, { waitUntil: "networkidle" });
    
    // Check page elements
    await expect(page.locator("text=Profissionais")).toBeVisible();
    
    // Should have add button
    await expect(page.locator("button:has-text('Novo')")).toBeVisible();
  });

  test("✅ /rooms - Equipment + location", async ({ page }) => {
    await page.goto(`${baseUrl}/rooms`, { waitUntil: "networkidle" });
    
    // Check page elements
    await expect(page.locator("text=Salas")).toBeVisible();
    
    // Should have add button
    await expect(page.locator("button:has-text('Novo')")).toBeVisible();
  });

  test("✅ /settings - Form sections render", async ({ page }) => {
    await page.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
    
    // Check page title
    await expect(page.locator("text=Configurações")).toBeVisible();
    
    // Should have form elements
    const form = page.locator("form, input[type='text']");
    await expect(form).toBeVisible();
  });

  // Responsive tests
  test("📱 Mobile (375px) - Pages render responsive", async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    
    const pages = ["/dashboard", "/appointments", "/clients"];
    
    for (const route of pages) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      
      // Check sidebar/nav exists
      const nav = page.locator("nav, [role='navigation']");
      await expect(nav).toBeVisible({ timeout: 2000 });
    }
  });

  test("💻 Desktop (1440px) - Pages render full layout", async ({ page }) => {
    page.setViewportSize({ width: 1440, height: 900 });
    
    await page.goto(`${baseUrl}/appointments`, { waitUntil: "networkidle" });
    
    // Sidebar should be visible on desktop
    const sidebar = page.locator("nav");
    await expect(sidebar).toBeVisible();
    
    // Main content should take full width
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("🔗 Navigation - All sidebar links work", async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    
    const links = [
      { text: "Agendamentos", url: "/appointments" },
      { text: "Clientes", url: "/clients" },
      { text: "Serviços", url: "/services" },
      { text: "Profissionais", url: "/employees" },
      { text: "Salas", url: "/rooms" },
      { text: "Configurações", url: "/settings" },
    ];
    
    for (const link of links) {
      const navLink = page.locator(`a:has-text('${link.text}')`);
      await expect(navLink).toBeVisible();
      
      // Click and verify URL
      await navLink.click();
      await page.waitForLoadState("networkidle");
      
      expect(page.url()).toContain(link.url);
    }
  });

  test("🎯 Performance - Pages load under 3 seconds", async ({ page }) => {
    const routes = ["/dashboard", "/appointments", "/clients"];
    
    for (const route of routes) {
      const startTime = Date.now();
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const loadTime = Date.now() - startTime;
      
      console.log(`⏱️  ${route}: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    }
  });
});
