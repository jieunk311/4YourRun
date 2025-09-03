import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plan');
  });

  test('should validate marathon information form fields', async ({ page }) => {
    // Test race name validation
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=레이스 이름을 입력해주세요')).toBeVisible();
    
    await page.fill('[data-testid="race-name"]', 'Test Marathon');
    
    // Test race date validation - past date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    await page.fill('[data-testid="race-date"]', pastDate.toISOString().split('T')[0]);
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=레이스 날짜는 미래여야 합니다')).toBeVisible();
    
    // Test race date validation - future date (should pass)
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    
    // Test distance selection
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    
    // Test target time validation - invalid values
    await page.fill('[data-testid="target-hours"]', '25'); // Invalid hour
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=시간은 0-23 사이여야 합니다')).toBeVisible();
    
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '65'); // Invalid minutes
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=분은 0-59 사이여야 합니다')).toBeVisible();
    
    // Fix all values
    await page.fill('[data-testid="target-minutes"]', '30');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    // Should proceed to next step
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=Step 2')).toBeVisible();
  });

  test('should validate running history form fields', async ({ page }) => {
    // Fill valid marathon info first
    await page.fill('[data-testid="race-name"]', 'Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    await page.fill('[data-testid="target-hours"]', '2');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    // Select has history
    await page.click('[data-testid="has-history-yes"]');
    
    // Test record date validation - too old (more than 6 months)
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 7);
    await page.fill('[data-testid="record-date-0"]', oldDate.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '10');
    await page.fill('[data-testid="record-hours-0"]', '1');
    await page.fill('[data-testid="record-minutes-0"]', '0');
    await page.fill('[data-testid="record-seconds-0"]', '0');
    
    await page.click('[data-testid="generate-plan-button"]');
    await expect(page.locator('text=기록 날짜는 최근 6개월 이내여야 합니다')).toBeVisible();
    
    // Test record date validation - future date
    const futureRecordDate = new Date();
    futureRecordDate.setDate(futureRecordDate.getDate() + 1);
    await page.fill('[data-testid="record-date-0"]', futureRecordDate.toISOString().split('T')[0]);
    await page.click('[data-testid="generate-plan-button"]');
    await expect(page.locator('text=기록 날짜는 과거여야 합니다')).toBeVisible();
    
    // Test distance validation - negative value
    const validRecordDate = new Date();
    validRecordDate.setMonth(validRecordDate.getMonth() - 1);
    await page.fill('[data-testid="record-date-0"]', validRecordDate.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '-5');
    await page.click('[data-testid="generate-plan-button"]');
    await expect(page.locator('text=거리는 양수여야 합니다')).toBeVisible();
    
    // Test distance validation - zero value
    await page.fill('[data-testid="record-distance-0"]', '0');
    await page.click('[data-testid="generate-plan-button"]');
    await expect(page.locator('text=거리는 양수여야 합니다')).toBeVisible();
    
    // Fix all values and submit
    await page.fill('[data-testid="record-distance-0"]', '10');
    await page.click('[data-testid="generate-plan-button"]');
    
    // Should proceed to loading
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
  });

  test('should handle multiple running records validation', async ({ page }) => {
    // Fill valid marathon info first
    await page.fill('[data-testid="race-name"]', 'Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    // Select has history
    await page.click('[data-testid="has-history-yes"]');
    
    // Add first valid record
    const validDate1 = new Date();
    validDate1.setMonth(validDate1.getMonth() - 1);
    await page.fill('[data-testid="record-date-0"]', validDate1.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '10');
    await page.fill('[data-testid="record-hours-0"]', '1');
    await page.fill('[data-testid="record-minutes-0"]', '0');
    await page.fill('[data-testid="record-seconds-0"]', '0');
    
    // Add second record
    await page.click('[data-testid="add-record-button"]');
    
    // Add invalid second record
    const validDate2 = new Date();
    validDate2.setMonth(validDate2.getMonth() - 2);
    await page.fill('[data-testid="record-date-1"]', validDate2.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-1"]', ''); // Empty distance
    await page.fill('[data-testid="record-hours-1"]', '0');
    await page.fill('[data-testid="record-minutes-1"]', '45');
    await page.fill('[data-testid="record-seconds-1"]', '0');
    
    await page.click('[data-testid="generate-plan-button"]');
    await expect(page.locator('text=거리를 입력해주세요')).toBeVisible();
    
    // Fix second record
    await page.fill('[data-testid="record-distance-1"]', '5');
    
    // Should be able to submit now
    await page.click('[data-testid="generate-plan-button"]');
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
  });
});