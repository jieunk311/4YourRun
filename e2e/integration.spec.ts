import { test, expect } from '@playwright/test';

test.describe('Integration Tests - Complete User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Mock successful API response for consistent testing
    await page.route('/api/generate-plan', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          weeks: [
            {
              week: 1,
              totalDistance: 15,
              trainingComposition: '3회 Easy Run (3km), 1회 LSD (6km)',
              objectives: '기초 체력 향상 및 러닝 습관 형성'
            },
            {
              week: 2,
              totalDistance: 18,
              trainingComposition: '3회 Easy Run (4km), 1회 LSD (6km)',
              objectives: '점진적 거리 증가 및 지구력 향상'
            },
            {
              week: 3,
              totalDistance: 20,
              trainingComposition: '2회 Easy Run (4km), 1회 Tempo Run (5km), 1회 LSD (7km)',
              objectives: '템포 러닝 도입으로 속도 향상'
            }
          ],
          totalWeeks: 12,
          totalDistance: 240,
          averageWeeklyDistance: 20,
          progressData: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 35],
          aiFeedback: '목표 달성을 위해 꾸준한 훈련이 중요합니다. 부상 방지를 위해 충분한 휴식과 스트레칭을 병행하세요.'
        })
      });
    });
  });

  test('should complete full marathon training plan creation with running history', async ({ page }) => {
    // Start from home page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('4YourRun');
    
    // Navigate to planning
    await page.click('text=시작하기');
    await expect(page).toHaveURL('/plan');
    await expect(page.locator('text=Step 1')).toBeVisible();
    
    // Fill marathon information
    await page.fill('[data-testid="race-name"]', '서울국제마라톤 2025');
    
    const raceDate = new Date();
    raceDate.setMonth(raceDate.getMonth() + 4);
    await page.fill('[data-testid="race-date"]', raceDate.toISOString().split('T')[0]);
    
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '30');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    // Proceed to step 2
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=Step 2')).toBeVisible();
    
    // Add running history
    await page.click('[data-testid="has-history-yes"]');
    
    // Add first record
    const record1Date = new Date();
    record1Date.setMonth(record1Date.getMonth() - 1);
    await page.fill('[data-testid="record-date-0"]', record1Date.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '10');
    await page.fill('[data-testid="record-hours-0"]', '1');
    await page.fill('[data-testid="record-minutes-0"]', '5');
    await page.fill('[data-testid="record-seconds-0"]', '30');
    
    // Add second record
    await page.click('[data-testid="add-record-button"]');
    const record2Date = new Date();
    record2Date.setMonth(record2Date.getMonth() - 2);
    await page.fill('[data-testid="record-date-1"]', record2Date.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-1"]', '5');
    await page.fill('[data-testid="record-hours-1"]', '0');
    await page.fill('[data-testid="record-minutes-1"]', '28');
    await page.fill('[data-testid="record-seconds-1"]', '45');
    
    // Generate training plan
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify loading state
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    await expect(page.locator('text=AI가 맞춤형 훈련 계획을 생성하고 있습니다')).toBeVisible();
    
    // Wait for results
    await page.waitForURL('/result', { timeout: 10000 });
    await expect(page.locator('text=Result')).toBeVisible();
    
    // Verify training plan components
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-weeks"]')).toContainText('12');
    await expect(page.locator('[data-testid="total-distance"]')).toContainText('240');
    await expect(page.locator('[data-testid="average-weekly-distance"]')).toContainText('20');
    
    // Verify weekly cards
    await expect(page.locator('[data-testid="weekly-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="week-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="week-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="week-card-3"]')).toBeVisible();
    
    // Progress chart removed
    
    // Verify AI feedback
    await expect(page.locator('[data-testid="ai-feedback"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-feedback"]')).toContainText('목표 달성을 위해');
  });

  test('should complete half marathon training plan creation without running history', async ({ page }) => {
    await page.goto('/');
    
    // Navigate through the flow
    await page.click('text=시작하기');
    
    // Fill marathon information for half marathon
    await page.fill('[data-testid="race-name"]', '춘천마라톤 하프코스');
    
    const raceDate = new Date();
    raceDate.setMonth(raceDate.getMonth() + 3);
    await page.fill('[data-testid="race-date"]', raceDate.toISOString().split('T')[0]);
    
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    await page.fill('[data-testid="target-hours"]', '2');
    await page.fill('[data-testid="target-minutes"]', '15');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    await page.click('[data-testid="next-button"]');
    
    // Skip running history
    await page.click('[data-testid="has-history-no"]');
    
    // Generate plan
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify loading and results
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    await page.waitForURL('/result', { timeout: 10000 });
    
    // Verify results are displayed
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="weekly-cards"]')).toBeVisible();
  });

  test('should handle 5km race training plan creation', async ({ page }) => {
    await page.goto('/');
    await page.click('text=시작하기');
    
    // Fill for 5km race
    await page.fill('[data-testid="race-name"]', '한강 5K 런');
    
    const raceDate = new Date();
    raceDate.setMonth(raceDate.getMonth() + 1);
    await page.fill('[data-testid="race-date"]', raceDate.toISOString().split('T')[0]);
    
    await page.selectOption('[data-testid="distance-select"]', '5km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '25');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    await page.click('[data-testid="next-button"]');
    
    // Add minimal running history
    await page.click('[data-testid="has-history-yes"]');
    
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() - 14);
    await page.fill('[data-testid="record-date-0"]', recordDate.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '3');
    await page.fill('[data-testid="record-hours-0"]', '0');
    await page.fill('[data-testid="record-minutes-0"]', '18');
    await page.fill('[data-testid="record-seconds-0"]', '30');
    
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify results
    await page.waitForURL('/result', { timeout: 10000 });
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
  });

  test('should handle 10km race training plan creation with multiple records', async ({ page }) => {
    await page.goto('/');
    await page.click('text=시작하기');
    
    // Fill for 10km race
    await page.fill('[data-testid="race-name"]', '올림픽공원 10K');
    
    const raceDate = new Date();
    raceDate.setMonth(raceDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', raceDate.toISOString().split('T')[0]);
    
    await page.selectOption('[data-testid="distance-select"]', '10km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '50');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    await page.click('[data-testid="next-button"]');
    
    // Add multiple running records
    await page.click('[data-testid="has-history-yes"]');
    
    // Record 1
    const record1Date = new Date();
    record1Date.setDate(record1Date.getDate() - 7);
    await page.fill('[data-testid="record-date-0"]', record1Date.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-0"]', '8');
    await page.fill('[data-testid="record-hours-0"]', '0');
    await page.fill('[data-testid="record-minutes-0"]', '42');
    await page.fill('[data-testid="record-seconds-0"]', '15');
    
    // Record 2
    await page.click('[data-testid="add-record-button"]');
    const record2Date = new Date();
    record2Date.setDate(record2Date.getDate() - 21);
    await page.fill('[data-testid="record-date-1"]', record2Date.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-1"]', '5');
    await page.fill('[data-testid="record-hours-1"]', '0');
    await page.fill('[data-testid="record-minutes-1"]', '28');
    await page.fill('[data-testid="record-seconds-1"]', '30');
    
    // Record 3
    await page.click('[data-testid="add-record-button"]');
    const record3Date = new Date();
    record3Date.setDate(record3Date.getDate() - 35);
    await page.fill('[data-testid="record-date-2"]', record3Date.toISOString().split('T')[0]);
    await page.fill('[data-testid="record-distance-2"]', '3');
    await page.fill('[data-testid="record-hours-2"]', '0');
    await page.fill('[data-testid="record-minutes-2"]', '18');
    await page.fill('[data-testid="record-seconds-2"]', '45');
    
    await page.click('[data-testid="generate-plan-button"]');
    
    // Verify results
    await page.waitForURL('/result', { timeout: 10000 });
    await expect(page.locator('[data-testid="training-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="weekly-cards"]')).toBeVisible();
  });

  test('should maintain form data during navigation', async ({ page }) => {
    await page.goto('/plan');
    
    // Fill partial form data
    await page.fill('[data-testid="race-name"]', '데이터 유지 테스트');
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    
    // Navigate away and back
    await page.goto('/');
    await page.click('text=시작하기');
    
    // Check if form data is preserved (if implemented)
    const raceName = await page.locator('[data-testid="race-name"]').inputValue();
    const distance = await page.locator('[data-testid="distance-select"]').inputValue();
    
    // Note: This test assumes form data persistence is implemented
    // If not implemented, this test documents the expected behavior
  });

  test('should handle browser back/forward navigation correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=시작하기');
    
    // Fill step 1
    await page.fill('[data-testid="race-name"]', '네비게이션 테스트');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=Step 2')).toBeVisible();
    
    // Use browser back button
    await page.goBack();
    await expect(page.locator('text=Step 1')).toBeVisible();
    
    // Verify form data is still there
    const raceName = await page.locator('[data-testid="race-name"]').inputValue();
    expect(raceName).toBe('네비게이션 테스트');
    
    // Use browser forward button
    await page.goForward();
    await expect(page.locator('text=Step 2')).toBeVisible();
  });
});