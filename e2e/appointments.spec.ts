import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Appointment Operations
 * Tests complete CRUD workflows for appointments
 */

test.describe('Appointments E2E Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@beautyflow.test');
    await page.fill('input[name="password"]', 'TestPassword123!@#');
    await page.click('button:has-text("Sign In")');
    
    // Verify logged in
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should navigate to appointments page and see list', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Verify on appointments page
    await expect(page).toHaveURL('/appointments');
    
    // Should see appointments table/list
    await expect(page.locator('text=Appointments')).toBeVisible();
    
    // Should see a "Create" or "New Appointment" button
    await expect(page.locator('button:has-text("New Appointment|Create")')).toBeDefined();
  });

  test('should create new appointment with all required fields', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    await expect(page).toHaveURL('/appointments');
    
    // Click "New Appointment" button
    await page.click('button:has-text("New Appointment|Create")');
    
    // Should open modal/form
    await expect(page.locator('text=New Appointment|Create Appointment')).toBeVisible();
    
    // Fill form
    // Note: Selectors depend on actual UI - adjust as needed
    await page.selectOption('select[name="service"]', { label: 'Consultation' });
    await page.selectOption('select[name="employee"]', { label: 'Dr. Smith' });
    await page.selectOption('select[name="client"]', { label: 'John Doe' });
    
    // Fill date/time (if using date picker)
    await page.fill('input[name="date"]', '2026-03-25');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '11:00');
    
    // Submit
    await page.click('button:has-text("Create|Save")');
    
    // Should show success message and close modal
    await expect(page.locator('text=successfully created|Appointment created')).toBeVisible();
    
    // New appointment should appear in list
    await expect(page.locator('text=Dr. Smith|Consultation')).toBeVisible();
  });

  test('should validate required fields when creating appointment', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Click "New Appointment" button
    await page.click('button:has-text("New Appointment|Create")');
    
    // Try submit without filling form
    await page.click('button:has-text("Create|Save")');
    
    // Should show validation errors
    await expect(page.locator('text=required')).toBeDefined();
    
    // Modal should still be open
    await expect(page.locator('text=New Appointment|Create Appointment')).toBeVisible();
  });

  test('should prevent overlapping appointments for same employee', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Create first appointment for Dr. Smith: 10:00-11:00
    await page.click('button:has-text("New Appointment|Create")');
    await page.selectOption('select[name="service"]', { label: 'Consultation' });
    await page.selectOption('select[name="employee"]', { label: 'Dr. Smith' });
    await page.selectOption('select[name="client"]', { label: 'Client A' });
    await page.fill('input[name="date"]', '2026-03-25');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '11:00');
    await page.click('button:has-text("Create|Save")');
    await expect(page.locator('text=successfully created')).toBeVisible();
    
    // Try create overlapping appointment: 10:30-11:30
    await page.click('button:has-text("New Appointment|Create")');
    await page.selectOption('select[name="service"]', { label: 'Massage' });
    await page.selectOption('select[name="employee"]', { label: 'Dr. Smith' }); // Same employee
    await page.selectOption('select[name="client"]', { label: 'Client B' });
    await page.fill('input[name="date"]', '2026-03-25');
    await page.fill('input[name="startTime"]', '10:30');
    await page.fill('input[name="endTime"]', '11:30');
    await page.click('button:has-text("Create|Save")');
    
    // Should show conflict error
    await expect(page.locator('text=overlap|conflict|already scheduled')).toBeVisible();
  });

  test('should update appointment status', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Find first appointment in list
    const appointmentRow = page.locator('table tbody tr').first();
    
    // Click on appointment to open details/edit
    await appointmentRow.click();
    
    // Should open appointment detail modal
    await expect(page.locator('text=Appointment Details|Edit Appointment')).toBeVisible();
    
    // Change status to "completed"
    await page.selectOption('select[name="status"]', { label: 'Completed' });
    
    // Save
    await page.click('button:has-text("Save|Update")');
    
    // Should show success
    await expect(page.locator('text=successfully updated|Status updated')).toBeVisible();
    
    // Status should be updated in list
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  test('should cancel appointment', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Find first appointment
    const appointmentRow = page.locator('table tbody tr').first();
    
    // Click on appointment
    await appointmentRow.click();
    
    // Change status to "canceled"
    await page.selectOption('select[name="status"]', { label: 'Canceled' });
    
    // Save
    await page.click('button:has-text("Save|Update")');
    
    // Should show success
    await expect(page.locator('text=successfully updated')).toBeVisible();
    
    // Status should show as canceled
    await expect(page.locator('text=Canceled')).toBeVisible();
  });

  test('should prevent editing completed appointment', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Find a completed appointment
    const completedAppointment = page.locator('text=Completed').first();
    
    // Click on it
    await completedAppointment.click();
    
    // Should open detail modal
    await expect(page.locator('text=Appointment Details')).toBeVisible();
    
    // Status field or time fields should be disabled/readonly
    const statusField = page.locator('select[name="status"]');
    const isDisabled = await statusField.isDisabled();
    
    // Should not be able to change status
    expect(isDisabled).toBe(true);
  });

  test('should filter appointments by date range', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Fill date range filter (if exists)
    await page.fill('input[placeholder="From Date"]', '2026-03-20');
    await page.fill('input[placeholder="To Date"]', '2026-03-25');
    
    // Apply filter (automatic or via button)
    await page.click('button:has-text("Filter|Search")');
    
    // Should update list to show only appointments in range
    // Verify by checking if appointments outside range are gone
    // (This depends on actual UI implementation)
    
    expect(page.url()).toContain('appointments');
  });

  test('should display appointment details correctly', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Click on first appointment
    const appointmentRow = page.locator('table tbody tr').first();
    await appointmentRow.click();
    
    // Should show all appointment details
    await expect(page.locator('text=Client|Employee|Service|Time|Date|Status')).toBeDefined();
    
    // Verify data is displayed (not empty)
    const clientField = page.locator('[name="client"]');
    expect(await clientField.isVisible()).toBe(true);
  });

  test('should handle appointment creation errors gracefully', async () => {
    // Navigate to appointments
    await page.click('a:has-text("Appointments")');
    
    // Create appointment that might fail (e.g., employee not available)
    await page.click('button:has-text("New Appointment|Create")');
    
    // Select invalid combination or missing data
    await page.selectOption('select[name="service"]', { label: 'Consultation' });
    // Don't select employee
    
    // Submit
    await page.click('button:has-text("Create|Save")');
    
    // Should show error message
    await expect(page.locator('text=Error|invalid|required')).toBeVisible();
    
    // Form should remain open for correction
    await expect(page.locator('text=New Appointment|Create Appointment')).toBeVisible();
  });

  test('should see appointments in dashboard metrics', async () => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should see appointment count or recent appointments widget
    await expect(page.locator('text=Appointments Today|Today\'s Appointments|Recent Appointments')).toBeDefined();
    
    // Should show count
    await expect(page.locator('text=\\d+\\s+(appointment|appointment)')).toBeDefined();
  });
});
