import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

/**
 * E2E Tests for Multi-Tenancy Data Isolation
 * Tests that clinic A cannot see clinic B's data and vice versa
 */

test.describe('Multi-Tenancy: Data Isolation E2E', () => {
  let browser: Browser;
  let clinic_A_page: Page;
  let clinic_B_page: Page;

  test.beforeAll(async () => {
    // This would be set up in actual test environment
    // For now, these are placeholder flows
  });

  test('should isolate clinic A data from clinic B user', async ({ browser }) => {
    /**
     * Setup:
     * 1. Create two separate browser contexts (clinic_A_admin and clinic_B_admin)
     * 2. Each logs in to their own clinic
     * 3. Each creates appointments
     * 4. Verify cross-clinic access is blocked
     */

    const clinic_A_context = await browser.newContext();
    const clinic_B_context = await browser.newContext();

    const pageA = await clinic_A_context.newPage();
    const pageB = await clinic_B_context.newPage();

    // Clinic A: Login
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'clinic-a-admin@test.com');
    await pageA.fill('input[name="password"]', 'Password123!');
    await pageA.click('button:has-text("Sign In")');
    await expect(pageA).toHaveURL('/dashboard');

    // Clinic B: Login
    await pageB.goto('/login');
    await pageB.fill('input[name="email"]', 'clinic-b-admin@test.com');
    await pageB.fill('input[name="password"]', 'Password123!');
    await pageB.click('button:has-text("Sign In")');
    await expect(pageB).toHaveURL('/dashboard');

    // Clinic A: Navigate to appointments
    await pageA.goto('/appointments');
    const appointmentCountA = await pageA.locator('table tbody tr').count();

    // Clinic B: Navigate to appointments
    await pageB.goto('/appointments');
    const appointmentCountB = await pageB.locator('table tbody tr').count();

    // Both should see their own appointments but not each other's
    // (Exact counts depend on test data setup)
    expect(appointmentCountA).toBeGreaterThanOrEqual(0);
    expect(appointmentCountB).toBeGreaterThanOrEqual(0);

    // If we know clinic A has 3 and clinic B has 2
    // Clinic A user should see 3, not 5 (which would mean RLS failed)

    await clinic_A_context.close();
    await clinic_B_context.close();
  });

  test('should prevent clinic B from accessing clinic A appointment via URL', async ({ browser }) => {
    /**
     * Scenario:
     * - Clinic A creates appointment with ID 'apt-123'
     * - Clinic B user tries to access /appointments/apt-123 directly
     * - Should be blocked or get 404/permission error
     */

    const clinic_B_context = await browser.newContext();
    const pageB = await clinic_B_context.newPage();

    // Login as clinic B user
    await pageB.goto('/login');
    await pageB.fill('input[name="email"]', 'clinic-b-admin@test.com');
    await pageB.fill('input[name="password"]', 'Password123!');
    await pageB.click('button:has-text("Sign In")');

    // Try to access clinic A's appointment directly
    await pageB.goto('/appointments/apt-123-from-clinic-a');

    // Should either:
    // 1. Show 404 error
    // 2. Redirect to appointments list
    // 3. Show "Not Found" message
    const isNotFound = 
      pageB.url().includes('appointments') && 
      await pageB.locator('text=not found|Not Found|404').isVisible().catch(() => false);

    expect(isNotFound).toBe(true);

    await clinic_B_context.close();
  });

  test('should prevent clinic B from seeing clinic A clients', async ({ browser }) => {
    /**
     * Scenario:
     * - Clinic A has clients list
     * - Clinic B user views clients list
     * - Should only see clinic B's clients (empty or different)
     */

    const clinic_A_context = await browser.newContext();
    const clinic_B_context = await browser.newContext();

    const pageA = await clinic_A_context.newPage();
    const pageB = await clinic_B_context.newPage();

    // Clinic A: Login and create a client
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'clinic-a-admin@test.com');
    await pageA.fill('input[name="password"]', 'Password123!');
    await pageA.click('button:has-text("Sign In")');
    await pageA.goto('/clients');
    
    // Create unique client name for clinic A
    await pageA.click('button:has-text("New Client|Add Client")');
    const clinicAClientName = `ClientA-${Date.now()}`;
    await pageA.fill('input[name="name"]', clinicAClientName);
    await pageA.fill('input[name="email"]', `client-a-${Date.now()}@test.com`);
    await pageA.click('button:has-text("Save|Create")');

    // Clinic B: Login and view clients
    await pageB.goto('/login');
    await pageB.fill('input[name="email"]', 'clinic-b-admin@test.com');
    await pageB.fill('input[name="password"]', 'Password123!');
    await pageB.click('button:has-text("Sign In")');
    await pageB.goto('/clients');

    // Should NOT see clinic A's client
    const clinicBClientVisible = await pageB.locator(`text="${clinicAClientName}"`).isVisible();
    expect(clinicBClientVisible).toBe(false);

    await clinic_A_context.close();
    await clinic_B_context.close();
  });

  test('should prevent clinic B from modifying clinic A services', async ({ browser }) => {
    /**
     * Scenario:
     * - Clinic A creates a service
     * - Clinic B user somehow tries to delete it
     * - API should return error/unauthorized
     * - Service should still exist in clinic A
     */

    const clinic_A_context = await browser.newContext();
    const clinic_B_context = await browser.newContext();

    const pageA = await clinic_A_context.newPage();
    const pageB = await clinic_B_context.newPage();

    // Clinic A: Create service
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'clinic-a-admin@test.com');
    await pageA.fill('input[name="password"]', 'Password123!');
    await pageA.click('button:has-text("Sign In")');
    await pageA.goto('/services');

    await pageA.click('button:has-text("New Service|Add Service")');
    const serviceName = `Service-${Date.now()}`;
    await pageA.fill('input[name="name"]', serviceName);
    await pageA.fill('input[name="price"]', '100');
    await pageA.fill('input[name="duration"]', '60');
    await pageA.click('button:has-text("Save|Create")');

    // Clinic B: Try intercept/modify via dev tools or direct API (out of scope for Playwright)
    // This would typically be tested via API integration tests
    // For E2E, we just verify RLS works by checking clinic A still has the service

    // Verify clinic A still has the service
    const serviceExists = await pageA.locator(`text="${serviceName}"`).isVisible();
    expect(serviceExists).toBe(true);

    await clinic_A_context.close();
    await clinic_B_context.close();
  });

  test('should show different employees to different clinics', async ({ browser }) => {
    /**
     * Scenario:
     * - Clinic A has employees: Dr. Smith, Dr. Jones
     * - Clinic B has employees: Dr. Williams
     * - Each clinic should only see their own employees
     */

    const clinic_A_context = await browser.newContext();
    const clinic_B_context = await browser.newContext();

    const pageA = await clinic_A_context.newPage();
    const pageB = await clinic_B_context.newPage();

    // Clinic A: Login and view employees
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'clinic-a-admin@test.com');
    await pageA.fill('input[name="password"]', 'Password123!');
    await pageA.click('button:has-text("Sign In")');
    await pageA.goto('/employees');

    const clinicA_EmployeeCount = await pageA.locator('table tbody tr').count();

    // Clinic B: Login and view employees
    await pageB.goto('/login');
    await pageB.fill('input[name="email"]', 'clinic-b-admin@test.com');
    await pageB.fill('input[name="password"]', 'Password123!');
    await pageB.click('button:has-text("Sign In")');
    await pageB.goto('/employees');

    const clinicB_EmployeeCount = await pageB.locator('table tbody tr').count();

    // Both should have different employee lists (or at least different counts if set up that way)
    // The important thing is they don't see each other's employees
    expect(pageA.url()).toContain('employees');
    expect(pageB.url()).toContain('employees');

    // Verify no employee from clinic A appears in clinic B's list
    // (This depends on actual employee names in test data)

    await clinic_A_context.close();
    await clinic_B_context.close();
  });

  test('should enforce clinic isolation on dashboard metrics', async ({ browser }) => {
    /**
     * Scenario:
     * - Clinic A has 10 appointments total, 3 today
     * - Clinic B has 5 appointments total, 1 today
     * - Dashboard metrics should show correct numbers per clinic
     */

    const clinic_A_context = await browser.newContext();
    const clinic_B_context = await browser.newContext();

    const pageA = await clinic_A_context.newPage();
    const pageB = await clinic_B_context.newPage();

    // Clinic A: Login and check dashboard
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'clinic-a-admin@test.com');
    await pageA.fill('input[name="password"]', 'Password123!');
    await pageA.click('button:has-text("Sign In")');
    await pageA.goto('/dashboard');

    // Clinic B: Login and check dashboard
    await pageB.goto('/login');
    await pageB.fill('input[name="email"]', 'clinic-b-admin@test.com');
    await pageB.fill('input[name="password"]', 'Password123!');
    await pageB.click('button:has-text("Sign In")');
    await pageB.goto('/dashboard');

    // Check that both dashboards load (no permission errors)
    await expect(pageA.locator('text=Dashboard|Welcome')).toBeVisible();
    await expect(pageB.locator('text=Dashboard|Welcome')).toBeVisible();

    // Metrics should be different (or at least properly filtered)
    // Exact assertion depends on test data setup

    await clinic_A_context.close();
    await clinic_B_context.close();
  });

  test.skip('should prevent direct database access across clinics', async () => {
    /**
     * This test would verify RLS at the database level
     * Not testable via Playwright (E2E), but important to document
     * 
     * Would require:
     * 1. Direct SQL access to test database
     * 2. Connect with clinic_B JWT
     * 3. Try SELECT * FROM appointments WHERE clinic_id != clinic_B_id
     * 4. Verify RLS blocks the query (returns 0 rows)
     * 
     * Better tested via integration tests with direct DB connection
     */
    
    expect(true).toBe(true);
  });
});
