// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 6: Tags y Grupos de Tests
 * ===============================
 * Organizar tests con tags para ejecutar subconjuntos.
 * 
 * Ejecutar por tag:
 * npx playwright test --grep @smoke
 * npx playwright test --grep @regression
 * npx playwright test --grep-invert @slow
 */

test.describe('Tests de Smoke (@smoke)', () => {

  test('Login básico @smoke @critical', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Página de productos carga @smoke', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

});

test.describe('Tests de Regresión (@regression)', () => {

  test('Agregar producto al carrito @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Ordenar productos @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
    await expect(firstPrice).toHaveText('$7.99');
  });

});

test.describe('Tests E2E Completos (@e2e)', () => {

  test('Flujo de compra completo @e2e @slow', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    await page.locator('[data-test="finish"]').click();
    
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

});
