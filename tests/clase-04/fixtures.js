// @ts-check
const base = require('@playwright/test');
const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('./pages');

/**
 * CLASE 4: Fixtures Personalizados
 * ================================
 * Los fixtures extienden el objeto `test` de Playwright
 * para inyectar automáticamente los Page Objects.
 * 
 * En lugar de:
 *   test('mi test', async ({ page }) => {
 *     const loginPage = new LoginPage(page);
 *     const inventoryPage = new InventoryPage(page);
 *     ...
 *   });
 * 
 * Podemos hacer:
 *   test('mi test', async ({ loginPage, inventoryPage }) => {
 *     // Los Page Objects ya están listos para usar
 *   });
 */

/**
 * @typedef {Object} SauceDemoFixtures
 * @property {LoginPage} loginPage
 * @property {InventoryPage} inventoryPage
 * @property {CartPage} cartPage
 * @property {CheckoutPage} checkoutPage
 */

/**
 * Extender el test de Playwright con fixtures personalizados
 */
const test = base.test.extend({
  
  /**
   * Fixture: loginPage
   * Proporciona una instancia de LoginPage
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Fixture: inventoryPage
   * Proporciona una instancia de InventoryPage
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Fixture: cartPage
   * Proporciona una instancia de CartPage
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Fixture: checkoutPage
   * Proporciona una instancia de CheckoutPage
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  /**
   * Fixture: authenticatedPage
   * Proporciona una página ya autenticada
   * Útil para tests que no necesitan probar el login
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await use(page);
  },

  /**
   * Fixture: pageWithProduct
   * Proporciona una página con un producto en el carrito
   */
  pageWithProduct: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    await use(page);
  },

  /**
   * Fixture: pageAtCheckout
   * Proporciona una página en el paso de checkout
   */
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

// Re-exportar expect para conveniencia
const { expect } = base;

module.exports = { test, expect };
