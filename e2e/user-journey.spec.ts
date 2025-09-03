import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full marathon training plan creation flow', async ({ page }) => {
    // Test home page
    await expect(page.locator('h1')).toContainText('4YourRun');
    await expect(page.locator('text=시작하기')).toBeVisible();
    
    // Start the journey
    await page.click('text=시작하기');
    await expect(page).toHaveURL('/plan');
    
    // Verify Step 1 progress indicator
    await expect(page.locator('text=Step 1')).toBeVisible();
    
    // Fill marathon information form
    await page.fill('[data-testid="race-name"]', 'Seoul Marathon 2025');
    
    // Select race date (future date)
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    const dateString = futureDate.toISOString().split('T')[0];
    await page.fill('[data-testid="race-date"]', dateString);
    
    // Select distance
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    
    // Fill target time
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '30');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    // Submit Step 1
    await page.click('[data-testid="next-button"]');
    
    // Verify Step 2 progress indicator
    await expect(page.locator('text=Step 2')).toBeVisible();
    
    // Test running history flow - with history
    await page.click('[data-testid="has-history-yes"]');
    
    // Add running record
    const recordDate = new Date();
    recordDate.setMonth(recordDate.getMonth() - 1);
    const recordDateString = recordDate.toISOString().split('T')[0];
    
    await page.fill('[data-testid="record-date-0"]', recordDateString);
    await page.fill('[data-testid="record-distance-0"]', '10');
    await page.fill('[data-testid="record-hours-0"]', '1');
    await page.fill('[data-testid="record-minutes-0"]', '0');
    await page.fill('[data-testid="record-seconds-0"]', '0');
    
    // Submit Step 2
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify loading animation
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    await expect(page.locator('text=AI가 맞춤형 훈련 계획을 생성하고 있습니다')).toBeVisible();
    
    // Wait for results page (with timeout for AI generation)
    await page.waitForURL('/result', { timeout: 30000 });
    
    // Verify results page content
    await expect(page.locator('text=Result')).toBeVisible();
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="weekly-cards"]')).toBeVisible();
    
    // Verify at least one weekly training card is present
    await expect(page.locator('[data-testid^="week-card-"]').first()).toBeVisible();
  });

  test('should handle user journey without running history', async ({ page }) => {
    // Navigate to plan page
    await page.click('text=시작하기');
    
    // Fill marathon information
    await page.fill('[data-testid="race-name"]', 'Test Marathon');
    
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    const dateString = futureDate.toISOString().split('T')[0];
    await page.fill('[data-testid="race-date"]', dateString);
    
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    await page.fill('[data-testid="target-hours"]', '2');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    await page.click('[data-testid="next-button"]');
    
    // Select no running history
    await page.click('[data-testid="has-history-no"]');
    
    // Submit without adding records
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify loading and results
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    await page.waitForURL('/result', { timeout: 30000 });
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
  });

  test('should validate form inputs correctly', async ({ page }) => {
    await page.click('text=시작하기');
    
    // Test empty form submission
    await page.click('[data-testid="next-button"]');
    
    // Verify validation errors are shown
    await expect(page.locator('text=레이스 이름을 입력해주세요')).toBeVisible();
    
    // Test invalid date (past date)
    await page.fill('[data-testid="race-name"]', 'Test Race');
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];
    await page.fill('[data-testid="race-date"]', pastDateString);
    
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=레이스 날짜는 미래여야 합니다')).toBeVisible();
    
    // Fix the date and continue
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];
    await page.fill('[data-testid="race-date"]', futureDateString);
    
    await page.selectOption('[data-testid="distance-select"]', '5km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '25');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    await page.click('[data-testid="next-button"]');
    
    // Should proceed to step 2
    await expect(page.locator('text=Step 2')).toBeVisible();
  });
});