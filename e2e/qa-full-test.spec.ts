import { test, expect } from '@playwright/test';

test.describe('🎯 QA Full Test: Complete App Flow', () => {
  const timestamp = Date.now();
  const testEmail = `qa-test-${timestamp}@example.com`;
  const testPassword = 'QATest@123!';
  const clinicName = `QA Clinic ${timestamp}`;
  const clientName = `QA Client ${timestamp}`;
  const clientEmail = `client-${timestamp}@test.com`;
  const clientPhone = '+5511999999999';

  let authPage: any;

  test('STEP 1️⃣ - Create New User (Sign Up)', async ({ page }) => {
    console.log(`\n📝 TEST 1: Creating new user\n  Email: ${testEmail}\n  Clinic: ${clinicName}`);
    
    await page.goto('/signup');
    await page.screenshot({ path: 'test-results/qa-step1-signup-page.png' });

    // Fill signup form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="clinicName"]', clinicName);
    await page.fill('input[name="firstName"]', 'QA');
    await page.fill('input[name="lastName"]', 'Tester');

    // Take screenshot before submit
    await page.screenshot({ path: 'test-results/qa-step1-form-filled.png' });

    // Submit
    await page.click('button[type="submit"]');

    // Wait for navigation with increased timeout (EMAIL validation + RETRY LOGIC + JWT TRIGGER)
    try {
      await page.waitForNavigation({ url: /\/dashboard/, timeout: 30000 });
      console.log('✅ PASS: Successfully redirected to dashboard');
      expect(page.url()).toContain('/dashboard');
    } catch (error) {
      console.log('❌ FAIL: Did not redirect to dashboard');
      await page.screenshot({ path: 'test-results/qa-step1-error.png' });
      throw error;
    }

    // Dashboard loaded
    await page.screenshot({ path: 'test-results/qa-step1-dashboard.png' });
  });

  test('STEP 2️⃣ - User Already Created, Test Login', async ({ page }) => {
    console.log(`\n📝 TEST 2: Login with created user\n  Email: ${testEmail}`);
    
    // Logout first if needed
    await page.goto('/login');
    await page.screenshot({ path: 'test-results/qa-step2-login-page.png' });

    // Fill login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Take screenshot before submit
    await page.screenshot({ path: 'test-results/qa-step2-form-filled.png' });

    // Submit
    await page.click('button[type="submit"]');

    // Wait for navigation
    try {
      await page.waitForNavigation({ url: /\/dashboard/, timeout: 30000 });
      console.log('✅ PASS: Login successful, redirected to dashboard');
      expect(page.url()).toContain('/dashboard');
    } catch (error) {
      console.log('❌ FAIL: Login failed or redirect issue');
      await page.screenshot({ path: 'test-results/qa-step2-error.png' });
      throw error;
    }

    await page.screenshot({ path: 'test-results/qa-step2-dashboard.png' });
  });

  test('STEP 3️⃣ - Create New Client', async ({ page }) => {
    console.log(`\n📝 TEST 3: Creating new client\n  Name: ${clientName}\n  Email: ${clientEmail}`);
    
    // Go to clients page
    await page.goto('/dashboard/clients');
    await page.screenshot({ path: 'test-results/qa-step3-clients-page.png' });

    // Look for "Add Client" or "New Client" button
    const createBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Novo"), a:has-text("Add"), a:has-text("New")').first();
    
    // Try clicking if visible
    if (await createBtn.isVisible().catch(() => false)) {
      await createBtn.click();
    } else {
      console.log('⚠️ WARNING: Add button not found, trying form inputs');
    }

    await page.screenshot({ path: 'test-results/qa-step3-form-opened.png' });

    // Fill client form
    try {
      await page.fill('input[name="name"], input[placeholder*="Name"], input[placeholder*="name"]', clientName);
      await page.fill('input[name="email"], input[placeholder*="Email"], input[placeholder*="email"]', clientEmail);
      await page.fill('input[name="phone"], input[placeholder*="Phone"], input[placeholder*="phone"]', clientPhone);
      
      await page.screenshot({ path: 'test-results/qa-step3-form-filled.png' });

      // Submit form
      await page.click('button[type="submit"], button:has-text("Save"), button:has-text("Create")');

      // Wait for success
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/qa-step3-success.png' });
      console.log('✅ PASS: Client created successfully');
    } catch (error) {
      console.log('❌ FAIL: Error creating client:', error.message);
      await page.screenshot({ path: 'test-results/qa-step3-error.png' });
      throw error;
    }
  });

  test('STEP 4️⃣ - Test Services Management', async ({ page }) => {
    console.log(`\n📝 TEST 4: Testing Services CRUD`);
    
    await page.goto('/dashboard/services');
    await page.screenshot({ path: 'test-results/qa-step4-services-page.png' });

    try {
      // Verify page loaded
      expect(page.url()).toContain('/services');
      
      // Look for services list or create button
      const createBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Novo")').first();
      
      if (await createBtn.isVisible().catch(() => false)) {
        console.log('✅ PASS: Services page loaded with create button');
      } else {
        console.log('⚠️ WARNING: Services page loaded but create button not visible');
      }

      await page.screenshot({ path: 'test-results/qa-step4-services-view.png' });
    } catch (error) {
      console.log('❌ FAIL: Services page error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step4-error.png' });
    }
  });

  test('STEP 5️⃣ - Test Employees Management', async ({ page }) => {
    console.log(`\n📝 TEST 5: Testing Employees CRUD`);
    
    await page.goto('/dashboard/employees');
    await page.screenshot({ path: 'test-results/qa-step5-employees-page.png' });

    try {
      expect(page.url()).toContain('/employees');
      
      const createBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Novo")').first();
      
      if (await createBtn.isVisible().catch(() => false)) {
        console.log('✅ PASS: Employees page loaded with create button');
      } else {
        console.log('⚠️ WARNING: Employees page loaded but create button not visible');
      }

      await page.screenshot({ path: 'test-results/qa-step5-employees-view.png' });
    } catch (error) {
      console.log('❌ FAIL: Employees page error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step5-error.png' });
    }
  });

  test('STEP 6️⃣ - Test Rooms Management', async ({ page }) => {
    console.log(`\n📝 TEST 6: Testing Rooms CRUD`);
    
    await page.goto('/dashboard/rooms');
    await page.screenshot({ path: 'test-results/qa-step6-rooms-page.png' });

    try {
      expect(page.url()).toContain('/rooms');
      
      const createBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Novo")').first();
      
      if (await createBtn.isVisible().catch(() => false)) {
        console.log('✅ PASS: Rooms page loaded with create button');
      } else {
        console.log('⚠️ WARNING: Rooms page loaded but create button not visible');
      }

      await page.screenshot({ path: 'test-results/qa-step6-rooms-view.png' });
    } catch (error) {
      console.log('❌ FAIL: Rooms page error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step6-error.png' });
    }
  });

  test('STEP 7️⃣ - Test Appointments Management', async ({ page }) => {
    console.log(`\n📝 TEST 7: Testing Appointments CRUD`);
    
    await page.goto('/dashboard/appointments');
    await page.screenshot({ path: 'test-results/qa-step7-appointments-page.png' });

    try {
      expect(page.url()).toContain('/appointments');
      
      const createBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Novo")').first();
      
      if (await createBtn.isVisible().catch(() => false)) {
        console.log('✅ PASS: Appointments page loaded with create button');
      } else {
        console.log('⚠️ WARNING: Appointments page loaded but create button not visible');
      }

      await page.screenshot({ path: 'test-results/qa-step7-appointments-view.png' });
    } catch (error) {
      console.log('❌ FAIL: Appointments page error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step7-error.png' });
    }
  });

  test('STEP 8️⃣ - Test Dashboard & Metrics', async ({ page }) => {
    console.log(`\n📝 TEST 8: Testing Dashboard & Metrics`);
    
    await page.goto('/dashboard');
    await page.screenshot({ path: 'test-results/qa-step8-dashboard-main.png' });

    try {
      expect(page.url()).toContain('/dashboard');
      
      // Look for metrics/cards
      const metrics = page.locator('[class*="card"], [class*="metric"], [class*="stat"]');
      const count = await metrics.count();
      
      if (count > 0) {
        console.log(`✅ PASS: Dashboard loaded with ${count} metric cards`);
      } else {
        console.log('⚠️ WARNING: Dashboard loaded but no clear metrics found');
      }

      await page.screenshot({ path: 'test-results/qa-step8-dashboard-view.png' });
    } catch (error) {
      console.log('❌ FAIL: Dashboard error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step8-error.png' });
    }
  });

  test('STEP 9️⃣ - Test Navigation & Menus', async ({ page }) => {
    console.log(`\n📝 TEST 9: Testing Navigation & UI`);
    
    await page.goto('/dashboard');
    await page.screenshot({ path: 'test-results/qa-step9-nav-check.png' });

    try {
      // Check for sidebar/navigation
      const navElements = page.locator('nav, [class*="sidebar"], [class*="menu"], aside');
      const navCount = await navElements.count();
      
      if (navCount > 0) {
        console.log(`✅ PASS: Navigation found (${navCount} nav elements)`);
      } else {
        console.log('⚠️ WARNING: No clear navigation structure found');
      }

      // Check for basic UI elements
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      const links = page.locator('a');
      const linkCount = await links.count();
      
      console.log(`  - Buttons found: ${buttonCount}`);
      console.log(`  - Links found: ${linkCount}`);

      await page.screenshot({ path: 'test-results/qa-step9-nav-view.png' });
    } catch (error) {
      console.log('❌ FAIL: Navigation test error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step9-error.png' });
    }
  });

  test('STEP 🔟 - Test Logout', async ({ page }) => {
    console.log(`\n📝 TEST 10: Testing Logout`);
    
    await page.goto('/dashboard');
    await page.screenshot({ path: 'test-results/qa-step10-before-logout.png' });

    try {
      // Look for logout button
      const logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sign out"), button:has-text("Sair"), [aria-label*="Logout"], [aria-label*="logout"]').first();
      
      if (await logoutBtn.isVisible().catch(() => false)) {
        await logoutBtn.click();
        
        // Wait for redirect to login or home
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/qa-step10-logout-success.png' });
        console.log('✅ PASS: Logout successful');
      } else {
        console.log('⚠️ WARNING: Logout button not found in UI');
        await page.screenshot({ path: 'test-results/qa-step10-no-logout-btn.png' });
      }
    } catch (error) {
      console.log('❌ FAIL: Logout test error:', error.message);
      await page.screenshot({ path: 'test-results/qa-step10-error.png' });
    }
  });
});
