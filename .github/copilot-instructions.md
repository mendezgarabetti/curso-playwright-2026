# Playwright Course Project - AI Coding Instructions

## Project Overview

This is a **Playwright testing course** with 6 progressive classes (clase-01 through clase-06) covering UI automation testing, API testing, and hybrid testing. The course uses **SauceDemo** (`https://www.saucedemo.com`) as the primary test application and teaches testing patterns from basics to advanced architectures.

## Key Architecture Patterns

### 1. Page Object Model (POM) - Classes 4+
Location: [tests/clase-04/](tests/clase-04/)

All page interactions are encapsulated in page classes following this structure:
- **Locators as Properties**: Elements defined as `page.locator()` in constructor
- **Actions as Methods**: User interactions wrapped in descriptive methods (`async login()`, `async addToCart()`)
- **Example**: [LoginPage.js](tests/clase-04/LoginPage.js) uses data-test selectors, [InventoryPage.js](tests/clase-04/InventoryPage.js), [CartPage.js](tests/clase-04/CartPage.js), [CheckoutPage.js](tests/clase-04/CheckoutPage.js)

**When adding new page objects:**
- Inherit from or follow the structure of existing pages
- Use `data-test` attributes (most robust), then CSS selectors
- Return `this` from navigation methods to enable chaining
- Group locators at top, actions below in order of test flow

### 2. Custom Fixtures for Dependency Injection
Location: [tests/clase-04/fixtures.js](tests/clase-04/fixtures.js)

Tests receive Page Objects automatically via fixtures instead of instantiating them manually.

```javascript
// Instead of: const loginPage = new LoginPage(page);
// Tests receive: async ({ loginPage, inventoryPage, cartPage, checkoutPage })
```

When extending fixtures, extend `base.test` and provide `use` factories.

### 3. Authentication State Management (Global Setup)
Location: [tests/clase-03/auth.setup.js](tests/clase-03/auth.setup.js)

Pre-authenticated sessions are stored to `.auth/user.json` and reused across tests, avoiding repeated logins. This pattern saves execution time in authenticated flows. The setup depends on `playwright.config.js` configuration with `dependencies: ['setup']`.

### 4. Test Organization by Concepts
- **clase-01**: Selectors, assertions, basics
- **clase-02**: Auto-wait, form interactions, dynamic elements
- **clase-03**: Trace viewer, storage state, debugging tools
- **clase-04**: Page Object Model, fixtures, refactoring
- **clase-05**: API testing, network interception, mocking
- **clase-06**: Multi-browser, mobile, environments, CI/CD

Each class has `01-*.spec.js` demos and `ejercicio-*.spec.js` practice files. Copy demo patterns when creating new tests.

## Critical Developer Commands

| Command | Purpose |
|---------|---------|
| `npx playwright test` | Run all tests headless |
| `npx playwright test --ui` | Interactive UI mode - **preferred for debugging** |
| `npx playwright test --debug` | Step-through debugger with inspector |
| `npx playwright test --headed` | Run with visible browser |
| `npx playwright test --project=chromium --headed` | Single browser for faster iteration |
| `npx playwright test tests/clase-04 --ui` | Debug specific class |
| `npx playwright show-report` | View HTML test report |
| `npx playwright codegen https://www.saucedemo.com` | Auto-generate selectors |

## Configuration Details

**[playwright.config.js](playwright.config.js)**:
- `fullyParallel: true` - Tests run in parallel by default
- `trace: 'retain-on-failure'` - Video/screenshots captured on failures
- `reporter: 'html'` - HTML reports in `playwright-report/`
- Multiple projects: chromium, firefox, webkit

## Test Data and Helpers

Location: [tests/clase-04/testData.js](tests/clase-04/testData.js)

Centralized test credentials and utilities:
```javascript
// Import and use predefined users, products, and calculation helpers
const { VALID_USER, VALID_PASSWORD, PRODUCTS } = require('./testData');
```

## Selector Strategy Hierarchy

From [clase-01/01-selectores.spec.js](tests/clase-01/01-selectores.spec.js):

1. **Level 1 (Preferred)**: `data-test` attributes - Most stable, SauceDemo-specific
   ```javascript
   page.locator('[data-test="username"]')
   ```
2. **Level 2**: CSS class selectors - Stable, visible in UI
   ```javascript
   page.locator('[class*="login_logo"]')
   ```
3. **Level 3**: Role selectors - Accessible, semantic
   ```javascript
   page.locator('role=button[name="Login"]')
   ```
4. **Level 4**: XPath - Last resort, fragile
   ```javascript
   page.locator('//button[@class="btn"]')
   ```

**Golden rule**: Avoid selectors that break when UI styling changes.

## Assertion Patterns

Use soft assertions to validate multiple conditions without stopping on first failure:
```javascript
// From clase-02/03-soft-assertions.spec.js
await expect.soft(page).toHaveTitle('Products');
await expect.soft(itemName).toBeVisible();
// Continue even if previous assertions fail
```

Hard assertions (normal `expect`) stop test execution immediately.

## API Testing Pattern (Clase-05)

When testing APIs:
- Use `request` fixture for standalone API calls: `const res = await request.get(url)`
- Use `page.request` for API calls within browser context
- Use `page.route()` to intercept/mock network requests for hybrid tests
- Reference [clase-05/01-api-testing-basico.spec.js](tests/clase-05/01-api-testing-basico.spec.js)

## Common Pitfalls to Avoid

1. **Using `page.waitForTimeout()`** - Anti-pattern; rely on auto-wait instead
2. **Brittle selectors** - Avoid complex XPaths or selectors tied to CSS internals
3. **Tests without assertions** - Every test must validate expected behavior
4. **Hardcoded waits** - Use `waitForSelector` or `waitForNavigation` with proper expectations
5. **No Page Objects for UI tests** - Refactor multi-test scripts into POM structure

## Adding New Tests

1. **Check the class level**: Is this for fundamentals (clase-01), interactions (clase-02), advanced (clase-03+)?
2. **Follow naming**: `XX-descriptive-topic.spec.js` for demos, `ejercicio-*.spec.js` for exercises
3. **Use appropriate pattern**:
   - Simple tests (clase-01/02): Direct page interactions
   - Complex flows (clase-04+): Page Objects + fixtures
   - API tests (clase-05): Use `request` fixture
4. **Import test data**: Use `testData.js` for credentials/products instead of hardcoding
5. **Run with `--ui` mode** to visually verify before committing

## File Reference Guide

Key files to review when onboarding or refactoring:
- **Test structure**: [tests/clase-02/06-happy-path-checkout.spec.js](tests/clase-02/06-happy-path-checkout.spec.js)
- **Page Objects example**: [tests/clase-04/LoginPage.js](tests/clase-04/LoginPage.js)
- **Fixtures pattern**: [tests/clase-04/fixtures.js](tests/clase-04/fixtures.js)
- **API testing**: [tests/clase-05/01-api-testing-basico.spec.js](tests/clase-05/01-api-testing-basico.spec.js)
- **Network mocking**: [tests/clase-05/03-intercepcion-red.spec.js](tests/clase-05/03-intercepcion-red.spec.js)
- **Quick reference**: [CHEATSHEET.md](CHEATSHEET.md)
