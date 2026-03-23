import { test, expect } from '@playwright/test';

test('DEBUG: Simple Sign Up with Logs', async ({ page }) => {
  const timestamp = Date.now();
  const testEmail = `qa-test-${timestamp}@example.com`;
  const testPassword = 'DebugTest@123!';
  const clinicName = `Debug Clinic ${timestamp}`;

  console.log('\n🔍 DEBUG TEST: Starting signup debug...');
  console.log(`  Email: ${testEmail}`);
  
  await page.goto('/signup');
  await page.waitForLoadState('domcontentloaded');
  
  // Fill form
  await page.fill('input[name="firstName"]', 'Debug');
  await page.fill('input[name="lastName"]', 'User');
  await page.fill('input[name="clinicName"]', clinicName);
  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="password"]', testPassword);
  
  console.log('📝 Form filled. About to submit...');
  
  // Take screenshot before submit
  await page.screenshot({ path: 'test-results/debug-before-submit.png' });
  
  // Submit
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  
  console.log('✅ Submit clicked. Waiting for response...');
  
  // Wait a bit to see what happens
  await page.waitForTimeout(3000);
  
  console.log('📍 Current URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-after-submit.png' });
  
  // Check if redirected
  if (page.url().includes('/dashboard')) {
    console.log('✅ REDIRECTED TO DASHBOARD!');
  } else if (page.url().includes('/signup')) {
    console.log('⚠️ Still on signup page');
    
    // Check for error message
    const errorMsg = page.locator('[class*="error"], [class*="red"]');
    const errorCount = await errorMsg.count();
    
    if (errorCount > 0) {
      const text = await errorMsg.first().textContent();
      console.log('❌ Error message:', text);
    }
  }
});
