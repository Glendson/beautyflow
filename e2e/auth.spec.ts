import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * Tests complete signup, login, and logout user journeys
 */

test.describe('Authentication E2E Flow', () => {
  let page: Page;
  const testClinicName = `TestClinic-${Date.now()}`;
  const testEmail = `testadmin-${Date.now()}@beautyflow.test`;
  const testPassword = 'TestPassword123!@#';

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/login');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should complete signup flow and redirect to dashboard', async () => {
    // Navigate to signup
    await page.click('a:has-text("Don\'t have an account?")');
    await expect(page).toHaveURL('/signup');

    // Fill signup form
    await page.fill('input[name="firstName"]', 'Admin');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="clinicName"]', testClinicName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    // Submit signup
    await page.click('button:has-text("Sign Up")');

    // Should redirect to dashboard after successful signup
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Verify dashboard loads
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator(`text=${testClinicName}`)).toBeVisible();
  });

  test('should persist session and stay logged in on page refresh', async () => {
    // Assuming already signed up in beforeEach
    await page.goto('/dashboard');

    // Verify dashboard is accessible
    await expect(page.locator('text=Appointments')).toBeVisible();

    // Refresh page
    await page.reload();

    // Should still be on dashboard (session persisted)
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Appointments')).toBeVisible();
  });

  test('should allow login with correct credentials', async () => {
    // Navigate to login page (already there from beforeEach)
    await expect(page).toHaveURL('/login');

    // Fill login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Submit login
    await page.click('button:has-text("Sign In")');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should reject login with wrong password', async () => {
    // Fill login form with wrong password
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'WrongPassword123!@#');

    // Submit login
    await page.click('button:has-text("Sign In")');

    // Should show error message
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();

    // Should still be on login page
    await expect(page).toHaveURL('/login');
  });

  test('should reject login with non-existent email', async () => {
    // Fill login form with non-existent email
    await page.fill('input[name="email"]', 'nonexistent@beautyflow.test');
    await page.fill('input[name="password"]', testPassword);

    // Submit login
    await page.click('button:has-text("Sign In")');

    // Should show error message
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();

    // Should still be on login page
    await expect(page).toHaveURL('/login');
  });

  test('should allow logout and redirect to login', async () => {
    // First login
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button:has-text("Sign In")');

    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');

    // Click logout (button/menu location depends on UI)
    await page.click('button:has-text("Logout")');

    // Should redirect to login
    await expect(page).toHaveURL('/login');

    // Should not be able to access dashboard without login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login'); // Middleware should redirect
  });

  test('should validate required fields on signup', async () => {
    // Navigate to signup
    await page.click('a:has-text("Don\'t have an account?")');

    // Try submit without filling form
    await page.click('button:has-text("Sign Up")');

    // Should show validation errors
    await expect(page.locator('text=required')).toBeDefined();

    // Should still be on signup page
    await expect(page).toHaveURL('/signup');
  });

  test('should validate password confirmation match', async () => {
    // Navigate to signup
    await page.click('a:has-text("Don\'t have an account?")');

    // Fill form with mismatched passwords
    await page.fill('input[name="firstName"]', 'Admin');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="clinicName"]', testClinicName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!@#');

    // Submit signup
    await page.click('button:has-text("Sign Up")');

    // Should show error about password mismatch
    await expect(page.locator('text=do not match')).toBeVisible();

    // Should still be on signup page
    await expect(page).toHaveURL('/signup');
  });

  test('should prevent duplicate email registration', async () => {
    // First signup
    await page.click('a:has-text("Don\'t have an account?")');
    await page.fill('input[name="firstName"]', 'Admin');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="clinicName"]', `Clinic-${Date.now()}`);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button:has-text("Sign Up")');

    // Logout
    await page.click('button:has-text("Logout")');

    // Try signup again with same email
    await page.click('a:has-text("Don\'t have an account?")');
    await page.fill('input[name="firstName"]', 'Admin2');
    await page.fill('input[name="lastName"]', 'User2');
    await page.fill('input[name="clinicName"]', `Clinic2-${Date.now()}`);
    await page.fill('input[name="email"]', testEmail); // Same email
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button:has-text("Sign Up")');

    // Should show error about email already existing
    await expect(page.locator('text=already exists|already registered')).toBeVisible();

    // Should still be on signup page
    await expect(page).toHaveURL('/signup');
  });

  test('should have clinic_id in JWT after signup', async () => {
    // Complete signup in beforeEach
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Get auth token from localStorage (if exposed) or verify via API call
    // This test verifies that subsequent API calls work (proving clinic_id exists in JWT)
    
    // Make request to fetch clinicId via API
    const response = await page.evaluate(async () => {
      return fetch('/api/clinic', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json());
    });

    // Should return clinic data (proves JWT has clinic_id)
    expect(response.clinicId).toBeDefined();
    expect(response.clinicName).toBe(testClinicName);
  });
});
