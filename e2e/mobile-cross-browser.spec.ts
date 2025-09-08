import { test, expect } from '@playwright/test';

test.describe('Mobile Chrome Tests', () => {

  test('should display correctly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check mobile-specific elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=시작하기')).toBeVisible();
    
    // Check button is thumb-friendly (minimum 44px)
    const startButton = page.locator('text=시작하기');
    const buttonBox = await startButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('should handle touch interactions', async ({ page }) => {
      await page.goto('/plan');
      
      // Test touch input on form fields
      await page.tap('[data-testid="race-name"]');
      await page.fill('[data-testid="race-name"]', 'Touch Test Marathon');
      
      // Test date picker touch interaction
      await page.tap('[data-testid="race-date"]');
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);
      await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
      
      // Test dropdown touch interaction
      await page.tap('[data-testid="distance-select"]');
      await page.selectOption('[data-testid="distance-select"]', 'Half');
      
      // Test time input touch interaction
      await page.tap('[data-testid="target-hours"]');
      await page.fill('[data-testid="target-hours"]', '2');
      await page.tap('[data-testid="target-minutes"]');
      await page.fill('[data-testid="target-minutes"]', '0');
      await page.tap('[data-testid="target-seconds"]');
      await page.fill('[data-testid="target-seconds"]', '0');
      
      // Test button touch
      await page.tap('[data-testid="next-button"]');
      await expect(page.locator('text=Step 2')).toBeVisible();
    });

  test('should scroll properly', async ({ page }) => {
      await page.goto('/plan');
      
      // Fill form to get to step 2
      await page.fill('[data-testid="race-name"]', 'Scroll Test Marathon');
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);
      await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
      await page.selectOption('[data-testid="distance-select"]', 'Full');
      await page.fill('[data-testid="target-hours"]', '4');
      await page.fill('[data-testid="target-minutes"]', '0');
      await page.fill('[data-testid="target-seconds"]', '0');
      await page.click('[data-testid="next-button"]');
      
      // Add multiple running records to test scrolling
      await page.click('[data-testid="has-history-yes"]');
      
      for (let i = 0; i < 3; i++) {
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
      
      // Test scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(page.locator('[data-testid="generate-plan-button"]')).toBeVisible();
      
      // Test scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('[data-testid="progress-indicator"]')).toBeVisible();
    });

  test('should handle orientation changes', async ({ page }) => {
      await page.goto('/');
      
      // Test portrait mode (default)
      const viewport = page.viewportSize();
      expect(viewport?.height).toBeGreaterThan(viewport?.width || 0);
      
      // Rotate to landscape (simulate orientation change)
      await page.setViewportSize({ 
        width: viewport?.height || 800, 
        height: viewport?.width || 400 
      });
      
      // Check content is still accessible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=시작하기')).toBeVisible();
      
      // Navigate and check form still works
      await page.click('text=시작하기');
      await expect(page.locator('[data-testid="race-name"]')).toBeVisible();
  });
});

test.describe('Mobile Safari Specific Tests', () => {

  test('should handle iOS Safari specific behaviors', async ({ page }) => {
    await page.goto('/plan');
    
    // Test iOS Safari date input behavior
    const dateInput = page.locator('[data-testid="race-date"]');
    await dateInput.click();
    
    // iOS Safari might show native date picker
    // Just verify the input is focusable and accepts input
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await dateInput.fill(futureDate.toISOString().split('T')[0]);
    
    const inputValue = await dateInput.inputValue();
    expect(inputValue).toBeTruthy();
  });

  test('should handle iOS Safari viewport behavior', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper viewport meta tag handling
    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.getAttribute('content');
    });
    
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');
  });

  test('should prevent zoom on input focus in iOS Safari', async ({ page }) => {
    await page.goto('/plan');
    
    // Check that inputs have proper font-size to prevent zoom
    const raceNameInput = page.locator('[data-testid="race-name"]');
    const fontSize = await raceNameInput.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    
    // Font size should be at least 16px to prevent iOS zoom
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(16);
  });
});

test.describe('Android Chrome Specific Tests', () => {

  test('should handle Android Chrome specific behaviors', async ({ page }) => {
    await page.goto('/plan');
    
    // Test Android Chrome form validation
    await page.click('[data-testid="next-button"]');
    
    // Should show validation messages
    await expect(page.locator('text=레이스 이름을 입력해주세요')).toBeVisible();
  });

  test('should handle Android Chrome keyboard behavior', async ({ page }) => {
    await page.goto('/plan');
    
    // Test numeric input keyboard on Android
    const hoursInput = page.locator('[data-testid="target-hours"]');
    await hoursInput.click();
    
    // Check input type for numeric keyboard
    const inputType = await hoursInput.getAttribute('type');
    expect(inputType).toBe('number');
  });

  test('should handle Android Chrome PWA features', async ({ page }) => {
    await page.goto('/');
    
    // Check for PWA manifest
    const manifestLink = await page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);
    
    // Check for service worker registration
    const swRegistration = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistration).toBe(true);
  });
});

test.describe('Mobile Performance Tests', () => {
  test('should load quickly on mobile', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for main content to be visible
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Should load within 2 seconds on mobile
    expect(loadTime).toBeLessThan(2000);
  });

  test('should handle form interactions smoothly', async ({ page }) => {
    await page.goto('/plan');
    
    const startTime = Date.now();
    
    // Rapid form filling
    await page.fill('[data-testid="race-name"]', 'Performance Test');
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await page.fill('[data-testid="race-date"]', futureDate.toISOString().split('T')[0]);
    await page.selectOption('[data-testid="distance-select"]', '10km');
    await page.fill('[data-testid="target-hours"]', '0');
    await page.fill('[data-testid="target-minutes"]', '45');
    await page.fill('[data-testid="target-seconds"]', '0');
    
    const fillTime = Date.now() - startTime;
    
    // Form should be responsive
    expect(fillTime).toBeLessThan(1000);
    
    // Navigation should be smooth
    const navStart = Date.now();
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('text=Step 2')).toBeVisible();
    const navTime = Date.now() - navStart;
    
    expect(navTime).toBeLessThan(500);
  });
});