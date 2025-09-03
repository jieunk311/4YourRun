import { test, expect } from '@playwright/test';

test.describe('AI Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully generate training plan with AI', async ({ page }) => {
    // Complete the form flow
    await page.click('text=시작하기');
    
    // Fill marathon information
    await page.fill('[data-testid="race-name"]', 'AI Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '30');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    // Add running history
    await page.click('[data-testid="has-history-yes"]');
    const recordDate = new Date();
    recordDate.setMonth(recordDate.getMonth() - 1);
    await page.fill('[data-testid="record-date-0"]', recordDate.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '10');
    await page.fill('[data-testid="record-hours-0"]', '1');
    await page.fill('[data-testid="record-minutes-0"]', '0');
    await page.fill('[data-testid="record-seconds-0"]', '0');
    
    // Submit for AI generation
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify loading state
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    await expect(page.locator('text=AI가 맞춤형 훈련 계획을 생성하고 있습니다')).toBeVisible();
    
    // Wait for AI response and navigation to results
    await page.waitForURL('/result', { timeout: 60000 });
    
    // Verify training plan structure
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
    
    // Check for training summary elements
    await expect(page.locator('[data-testid="total-weeks"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-distance"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-weekly-distance"]')).toBeVisible();
    
    // Verify weekly training cards are present
    const weeklyCards = page.locator('[data-testid^="week-card-"]');
    await expect(weeklyCards.first()).toBeVisible();
    
    // Check that at least one weekly card has proper content
    const firstCard = weeklyCards.first();
    await expect(firstCard.locator('[data-testid="week-number"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="total-distance"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="training-composition"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="objectives"]')).toBeVisible();
    
    // Progress chart removed
    
    // Verify AI feedback section
    await expect(page.locator('[data-testid="ai-feedback"]')).toBeVisible();
  });

  test('should handle AI generation errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/generate-plan', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'AI service temporarily unavailable' })
      });
    });
    
    // Complete the form flow
    await page.click('text=시작하기');
    
    await page.fill('[data-testid="race-name"]', 'Error Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    await page.fill('[data-testid="target-hours"]', '2');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    await page.click('[data-testid="has-history-no"]');
    await page.click('[data-testid="generate-plan-button"]');
    
    // Should show loading first
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('text=AI 서비스에 일시적인 문제가 발생했습니다')).toBeVisible();
    
    // Should show retry button
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('should handle AI timeout gracefully', async ({ page }) => {
    // Mock API to delay response beyond timeout
    await page.route('/api/generate-plan', route => {
      // Delay for longer than expected timeout
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            weeks: [],
            totalWeeks: 0,
            totalDistance: 0,
            averageWeeklyDistance: 0,
            progressData: [],
            aiFeedback: 'Delayed response'
          })
        });
      }, 35000); // 35 second delay
    });
    
    // Complete the form flow
    await page.click('text=시작하기');
    
    await page.fill('[data-testid="race-name"]', 'Timeout Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', '10km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '50');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    await page.click('[data-testid="has-history-no"]');
    await page.click('[data-testid="generate-plan-button"]');
    
    // Should show loading
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    
    // Should eventually show timeout error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 40000 });
    await expect(page.locator('text=요청 시간이 초과되었습니다')).toBeVisible();
  });

  test('should retry AI generation on user request', async ({ page }) => {
    let requestCount = 0;
    
    // Mock API to fail first time, succeed second time
    await page.route('/api/generate-plan', route => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Temporary failure' })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            weeks: [
              {
                week: 1,
                totalDistance: 20,
                trainingComposition: '3회 Easy Run (5km), 1회 LSD (5km)',
                objectives: '기초 체력 향상'
              }
            ],
            totalWeeks: 12,
            totalDistance: 240,
            averageWeeklyDistance: 20,
            progressData: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 35],
            aiFeedback: '꾸준한 훈련으로 목표를 달성하세요!'
          })
        });
      }
    });
    
    // Complete the form flow
    await page.click('text=시작하기');
    
    await page.fill('[data-testid="race-name"]', 'Retry Test Marathon');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', '5km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '25');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    await page.click('[data-testid="has-history-no"]');
    await page.click('[data-testid="generate-plan-button"]');
    
    // Should show error first
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Click retry
    await page.click('[data-testid="retry-button"]');
    
    // Should show loading again
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    
    // Should succeed and navigate to results
    await page.waitForURL('/result', { timeout: 30000 });
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
  });
});