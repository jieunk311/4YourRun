import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues on home page', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have any automatically detectable accessibility issues on plan page', async ({ page }) => {
    await page.goto('/plan');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues during form interaction', async ({ page }) => {
    await page.goto('/plan');
    
    // Fill out form partially
    await page.fill('[data-testid="race-name"]', 'Accessibility Test Marathon');
    
    // Check accessibility after form interaction
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on step 2', async ({ page }) => {
    await page.goto('/plan');
    
    // Complete step 1
    await page.fill('[data-testid="race-name"]', 'Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    await page.fill('[data-testid="target-hours"]', '2');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    // Check accessibility on step 2
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues with running history form', async ({ page }) => {
    await page.goto('/plan');
    
    // Navigate to step 2
    await page.fill('[data-testid="race-name"]', 'Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    // Select has history and add record
    await page.click('[data-testid="has-history-yes"]');
    
    const recordDate = new Date();
    recordDate.setMonth(recordDate.getMonth() - 1);
    await page.fill('[data-testid="record-date-0"]', recordDate.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '10');
    
    // Check accessibility with form filled
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on loading page', async ({ page }) => {
    await page.goto('/loading');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation on home page
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Navigate to plan page using keyboard
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/plan');
    
    // Test form navigation with keyboard
    await page.keyboard.press('Tab'); // Race name field
    await page.keyboard.type('Keyboard Test Marathon');
    
    await page.keyboard.press('Tab'); // Race date field
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.keyboard.type(futureDate.toISOString().split('T')[0]);
    
    await page.keyboard.press('Tab'); // Distance select
    await page.keyboard.press('ArrowDown'); // Select next option
    
    await page.keyboard.press('Tab'); // Hours field
    await page.keyboard.type('2');
    
    await page.keyboard.press('Tab'); // Minutes field
    await page.keyboard.type('30');
    
    await page.keyboard.press('Tab'); // Seconds field
    await page.keyboard.type('0');
    
    await page.keyboard.press('Tab'); // Next button
    await page.keyboard.press('Enter'); // Submit form
    
    // Should navigate to step 2
    await expect(page.locator('text=Step 2')).toBeVisible();
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/plan');
    
    // Check for proper form labels
    await expect(page.locator('label[for="race-name"]')).toBeVisible();
    await expect(page.locator('label[for="race-date"]')).toBeVisible();
    await expect(page.locator('label[for="distance-select"]')).toBeVisible();
    
    // Check for proper button roles
    await expect(page.locator('[data-testid="next-button"]')).toHaveAttribute('role', 'button');
    
    // Check for proper form structure
    await expect(page.locator('form')).toHaveAttribute('role', 'form');
    
    // Check progress indicator has proper ARIA
    await expect(page.locator('[data-testid="progress-indicator"]')).toHaveAttribute('role', 'progressbar');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Test with high contrast requirements
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be usable with screen reader', async ({ page }) => {
    await page.goto('/plan');
    
    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for proper form field descriptions
    await expect(page.locator('[data-testid="race-name"]')).toHaveAttribute('aria-describedby');
    
    // Check for error message associations
    await page.click('[data-testid="next-button"]'); // Trigger validation
    
    const errorMessage = page.locator('[data-testid="race-name-error"]');
    if (await errorMessage.isVisible()) {
      await expect(page.locator('[data-testid="race-name"]')).toHaveAttribute('aria-describedby');
    }
  });
});