# End-to-End Testing Documentation

This directory contains comprehensive end-to-end tests for the 4YourRun marathon training planner application.

## Test Structure

### Test Files

1. **user-journey.spec.ts** - Complete user journey tests
   - Full marathon training plan creation flow
   - User journey without running history
   - Form validation during user flow

2. **form-validation.spec.ts** - Form validation tests
   - Marathon information form validation
   - Running history form validation
   - Multiple running records validation

3. **ai-integration.spec.ts** - AI integration tests
   - Successful AI training plan generation
   - AI error handling
   - AI timeout handling
   - Retry functionality

4. **accessibility.spec.ts** - Accessibility compliance tests
   - WCAG 2.1 AA compliance testing
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA labels and roles
   - Color contrast validation

5. **performance.spec.ts** - Performance benchmarks
   - Lighthouse performance audits
   - Mobile network simulation
   - Form interaction performance
   - Asset loading optimization

6. **mobile-cross-browser.spec.ts** - Mobile cross-browser tests
   - iOS Safari specific behaviors
   - Android Chrome specific behaviors
   - Touch interactions
   - Viewport handling
   - Orientation changes

7. **integration.spec.ts** - Integration tests
   - Complete user journeys for all race distances
   - Form data persistence
   - Browser navigation handling

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Run specific test suites
npm run test:accessibility
npm run test:performance
npm run test:mobile
npm run test:integration

# Run all tests (unit + E2E)
npm run test:all
```

### Test Configuration

The tests are configured in `playwright.config.ts` with the following settings:

- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Devices**: iPhone 12, iPhone 13 Pro, Pixel 5, Galaxy S21
- **Base URL**: http://localhost:3000
- **Retries**: 2 on CI, 0 locally
- **Timeout**: 30 seconds default
- **Trace**: On first retry

## Test Coverage

### Requirements Coverage

The E2E tests cover all requirements from the requirements document:

#### Requirement 1: Marathon Information Input
- ✅ Race name, date, distance, target time validation
- ✅ Distance dropdown options (5km, 10km, Half, Full)
- ✅ Time input validation (hours, minutes, seconds)
- ✅ Future date validation
- ✅ Form submission validation

#### Requirement 2: Running History Input
- ✅ Optional running history collection
- ✅ 6-month history limit validation
- ✅ Multiple record entry capability
- ✅ Distance and time validation
- ✅ Skip history option

#### Requirement 3: Loading Animation
- ✅ Animated runners during AI processing
- ✅ Loading state maintenance
- ✅ Automatic navigation to results

#### Requirement 4: Training Plan Display
- ✅ Weekly training cards in table format
- ✅ Week number, distance, composition display
- ✅ Training objectives presentation
- ✅ Run type specifications

#### Requirement 5: Training Summary
- ✅ Total training weeks display
- ✅ Total distance calculation
- ✅ Average weekly distance
- ✅ Progress visualization
- ✅ AI feedback and tips

#### Requirement 6: Mobile Optimization
- ✅ 375px-430px screen optimization
- ✅ Fixed progress indicator
- ✅ Thumb-friendly button sizing
- ✅ Touch scrolling and gestures
- ✅ Mobile-optimized card layouts

#### Requirement 7: Navigation Structure
- ✅ Home page with service introduction
- ✅ Step-by-step navigation flow
- ✅ Clear step indicators
- ✅ Proper page routing

#### Requirement 8: Validation and Error Handling
- ✅ Future date validation
- ✅ Required field validation
- ✅ 6-month history limit
- ✅ Clear error messages
- ✅ Form submission prevention on errors

### Browser Coverage

- **Desktop**: Chrome, Firefox, Safari (WebKit)
- **Mobile**: iOS Safari, Android Chrome
- **Devices**: iPhone 12/13 Pro, Pixel 5, Galaxy S21

### Accessibility Coverage

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** validation
- **ARIA labels** and roles
- **Focus management**

### Performance Coverage

- **Lighthouse audits** (Performance, Accessibility, Best Practices, SEO)
- **Mobile network** simulation
- **Loading time** benchmarks
- **Form interaction** responsiveness
- **Asset optimization** validation

## Test Data

### Mock API Responses

The tests use consistent mock API responses for reliable testing:

```javascript
{
  weeks: [
    {
      week: 1,
      totalDistance: 15,
      trainingComposition: "3회 Easy Run (3km), 1회 LSD (6km)",
      objectives: "기초 체력 향상 및 러닝 습관 형성"
    }
    // ... more weeks
  ],
  totalWeeks: 12,
  totalDistance: 240,
  averageWeeklyDistance: 20,
  progressData: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 35],
  aiFeedback: "목표 달성을 위해 꾸준한 훈련이 중요합니다..."
}
```

### Test Data Patterns

- **Race Names**: Korean and English names
- **Dates**: Future dates (1-4 months ahead)
- **Distances**: All supported race distances
- **Target Times**: Realistic time goals
- **Running Records**: Valid historical data within 6 months

## Debugging Tests

### Common Issues

1. **Test Timeouts**: Increase timeout for AI integration tests
2. **Element Not Found**: Check data-testid attributes in components
3. **Network Issues**: Verify mock API responses
4. **Mobile Tests**: Ensure proper device emulation

### Debug Commands

```bash
# Run specific test file
npx playwright test user-journey.spec.ts

# Run specific test
npx playwright test -g "should complete full marathon training plan"

# Run with debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report
```

## Continuous Integration

The tests are designed to run in CI environments with:

- **Headless mode** by default
- **Retry logic** for flaky tests
- **Parallel execution** for faster runs
- **HTML reports** for test results
- **Screenshot/video** capture on failures

## Maintenance

### Adding New Tests

1. Follow existing naming conventions
2. Use proper data-testid attributes
3. Include accessibility checks
4. Add mobile device testing
5. Update this documentation

### Updating Tests

1. Keep tests in sync with UI changes
2. Update mock API responses as needed
3. Maintain cross-browser compatibility
4. Verify accessibility compliance
5. Update performance benchmarks

## Performance Benchmarks

### Target Metrics

- **Performance Score**: ≥85 (desktop), ≥80 (mobile)
- **Accessibility Score**: ≥95
- **Best Practices Score**: ≥85
- **SEO Score**: ≥85 (desktop), ≥80 (mobile)
- **Load Time**: <2s (mobile), <1s (desktop)
- **Form Interaction**: <500ms response time

### Monitoring

Regular performance monitoring ensures the application maintains optimal user experience across all supported devices and browsers.