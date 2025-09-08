import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Performance Tests', () => {
  test('should meet performance benchmarks on home page', async ({ page }) => {
    await page.goto('/');
    
    // Run Lighthouse audit
    await playAudit({
      page,
      thresholds: {
        performance: 85,
        accessibility: 95,
        'best-practices': 85,
        seo: 85,
      },
      port: 9222,
    });
  });

  test('should meet performance benchmarks on plan page', async ({ page }) => {
    await page.goto('/plan');
    
    await playAudit({
      page,
      thresholds: {
        performance: 80, // Slightly lower due to form complexity
        accessibility: 95,
        'best-practices': 85,
        seo: 80,
      },
      port: 9222,
    });
  });

  test('should load quickly on mobile network simulation', async ({ page }) => {
    // Simulate slow 3G network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });
    
    const startTime = Date.now();
    await page.goto('/');
    
    // Check that critical content loads within reasonable time
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds even on slow network
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large form data efficiently', async ({ page }) => {
    await page.goto('/plan');
    
    const startTime = Date.now();
    
    // Fill form with data
    await page.fill('[data-testid="race-name"]', 'Performance Test Marathon with Very Long Name That Tests Input Handling');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Full');
    await page.fill('[data-testid="target-hours"]', '4');
    await page.fill('[data-testid="target-minutes"]', '30');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    const formFillTime = Date.now() - startTime;
    
    // Form interaction should be responsive
    expect(formFillTime).toBeLessThan(1000);
    
    // Navigation should be fast
    const navStartTime = Date.now();
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=Step 2')).toBeVisible();
    const navTime = Date.now() - navStartTime;
    
    expect(navTime).toBeLessThan(500);
  });

  test('should handle multiple running records efficiently', async ({ page }) => {
    await page.goto('/plan');
    
    // Navigate to step 2
    await page.fill('[data-testid="race-name"]', 'Multi Record Test');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', 'Half');
    await page.fill('[data-testid="target-hours"]', '2');
    await page.fill('[data-testid="target-minutes"]', '0');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    await page.click('[data-testid="has-history-yes"]');
    
    const startTime = Date.now();
    
    // Add multiple records
    for (let i = 0; i < 5; i++) {
      if (i > 0) {
        await page.click('[data-testid="add-record-button"]');
      }
      
      const recordDate = new Date();
      recordDate.setMonth(recordDate.getMonth() - (i + 1));
      await page.fill(`[data-testid="record-date-${i}"]`, recordDate.toISOString().split('T')[0]);
      await page.fill(`[data-testid="record-distance-${i}"]`, `${5 + i}`);
      await page.fill(`[data-testid="record-hours-${i}"]`, '0');
      await page.fill(`[data-testid="record-minutes-${i}"]`, `${30 + i * 5}`);
      await page.fill(`[data-testid="record-seconds-${i}"]`, '0');
    }
    
    const recordAddTime = Date.now() - startTime;
    
    // Adding multiple records should be efficient
    expect(recordAddTime).toBeLessThan(2000);
    
    // Form should remain responsive
    await expect(page.locator('[data-testid="generate-plan-button"]')).toBeEnabled();
  });

  test('should optimize image and asset loading', async ({ page }) => {
    // Monitor network requests
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that no unnecessary large assets are loaded
    const imageRequests = requests.filter(url => 
      url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp')
    );
    
    // Should minimize image requests on initial load
    expect(imageRequests.length).toBeLessThan(5);
  });

  test('should have efficient JavaScript bundle size', async ({ page }) => {
    const responses: Array<{ url: string; size: string | undefined }> = [];
    page.on('response', response => {
      if (response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total JS bundle size
    const totalJSSize = responses.reduce((total, response) => {
      const size = parseInt(response.size || '0');
      return total + size;
    }, 0);
    
    // Should keep JS bundle under reasonable size (500KB)
    expect(totalJSSize).toBeLessThan(500000);
  });

  test('should handle loading animation performance', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/generate-plan', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            weeks: [{ week: 1, totalDistance: 20, trainingComposition: 'Test', objectives: 'Test' }],
            totalWeeks: 1,
            totalDistance: 20,
            averageWeeklyDistance: 20,
            progressData: [20],
            aiFeedback: 'Test feedback'
          })
        });
      }, 2000);
    });
    
    await page.goto('/plan');
    
    // Complete form quickly
    await page.fill('[data-testid="race-name"]', 'Animation Test');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', '5km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '25');
    await page.fill('[data-testid="target-seconds"]', '0');
    await page.click('[data-testid="next-button"]');
    
    await page.click('[data-testid="has-history-no"]');
    
    const startTime = Date.now();
    await page.click('[data-testid="generate-plan-button"]');
    
    // Loading animation should appear quickly
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
    const animationAppearTime = Date.now() - startTime;
    
    expect(animationAppearTime).toBeLessThan(200);
    
    // Animation should be smooth (check for presence during loading)
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="loading-animation"]')).toBeVisible();
  });
});