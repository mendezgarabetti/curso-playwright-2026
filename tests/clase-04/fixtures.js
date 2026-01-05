// @ts-check
import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';

/**
 * CLASE 4: Fixtures Personalizados
 * ================================
 * Extiende el test de Playwright con Page Objects inyectados.
 * 
 * En lugar de:
 *   test('mi test', async ({ page }) => {
 *     const loginPage = new LoginPage(page);
 *   });
 * 
 * Puedes hacer:
 *   test('mi test', async ({ loginPage }) => {
 *     // loginPage ya está listo
 *   });
 */

export const test = base.extend({
  
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  // Fixture: Página ya autenticada
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await use(page);
  },

  // Fixture: Página con producto en carrito
  pageWithProduct: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    await use(page);
  },

  // Fixture: Página en checkout
  pageAtCheckout: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    
    await use(page);
  }
});

export { expect };
