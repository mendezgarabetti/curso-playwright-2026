// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 6: Tests Multi-Browser
 * ============================
 * Playwright ejecuta en Chrome, Firefox y Safari.
 * 
 * Ejecutar:
 * npx playwright test --project=chromium
 * npx playwright test --project=firefox
 * npx playwright test --project=webkit
 * npx playwright test  # Todos los browsers
 */

test.describe('Tests Cross-Browser', () => {

  test('Login funciona en todos los navegadores', async ({ page, browserName }) => {
    console.log(`🌐 Ejecutando en: ${browserName}`);
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('Carrito funciona en todos los navegadores', async ({ page, browserName }) => {
    console.log(`🌐 Ejecutando en: ${browserName}`);
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);
  });

});

test.describe('Tests Específicos por Browser', () => {

  test('Test solo en Chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Solo Chrome');
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('.login_logo')).toBeVisible();
  });

  test('Test solo en Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Solo Firefox');
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('.login_logo')).toBeVisible();
  });

  test('Test solo en Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Solo Safari');
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('.login_logo')).toBeVisible();
  });

});
