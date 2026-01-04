// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';

/**
 * CLASE 4: Comparación - Sin POM vs Con POM
 * =========================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// ANTES: Tests SIN Page Object Model
// ═══════════════════════════════════════════════════════════════════════════

test.describe('❌ SIN POM: Tests con selectores repetidos', () => {

  test('Login exitoso - sin POM', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login fallido - sin POM', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Agregar al carrito - sin POM', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

/**
 * PROBLEMAS del código anterior:
 * 1. SELECTORES REPETIDOS
 * 2. CÓDIGO DUPLICADO
 * 3. DIFÍCIL DE LEER
 * 4. DIFÍCIL DE MANTENER
 */

// ═══════════════════════════════════════════════════════════════════════════
// DESPUÉS: Tests CON Page Object Model
// ═══════════════════════════════════════════════════════════════════════════

test.describe('✅ CON POM: Tests limpios y mantenibles', () => {

  test('Login exitoso - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login fallido - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsLockedUser();
    
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Agregar al carrito - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Checkout completo - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    
    await cartPage.proceedToCheckout();
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    await checkoutPage.finish();
    
    const message = await checkoutPage.getSuccessMessage();
    expect(message).toBe('Thank you for your order!');
  });

});

/**
 * BENEFICIOS del código con POM:
 * 1. SELECTORES CENTRALIZADOS
 * 2. CÓDIGO REUTILIZABLE
 * 3. FÁCIL DE LEER
 * 4. FÁCIL DE MANTENER
 */
