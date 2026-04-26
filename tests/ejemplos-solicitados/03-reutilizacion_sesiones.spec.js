import { test, expect } from '@playwright/test';

// 🔵 Usa sesión (default)
test('usuario logueado', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveURL(/.*inventory.html/);
});

// 🔴 SIN sesión
test.describe('sin auth', () => {
  test.use({ storageState: undefined });

  test('login visible', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});