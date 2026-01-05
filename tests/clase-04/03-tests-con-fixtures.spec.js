// @ts-check

/**
 * CLASE 4: Tests con Fixtures Personalizados
 * ==========================================
 * Usando los fixtures definidos en fixtures.js,
 * los tests son aún más limpios.
 */

import { test, expect } from './fixtures.js';
import { InventoryPage } from './pages/InventoryPage.js';

test.describe('Tests con Fixtures: Page Objects Inyectados', () => {

  test('Login usando fixture loginPage', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
  });

  test('Inventario usando fixture inventoryPage', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Checkout usando múltiples fixtures', async ({ 
    loginPage, 
    inventoryPage, 
    cartPage, 
    checkoutPage 
  }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    
    await cartPage.proceedToCheckout();
    
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    await checkoutPage.finish();
    
    const isComplete = await checkoutPage.isOrderComplete();
    expect(isComplete).toBe(true);
  });

});

test.describe('Tests con Fixtures Avanzados', () => {

  test('Test en página ya autenticada', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    
    const count = await inventory.getProductCount();
    expect(count).toBe(6);
  });

  test('Test con producto ya en carrito', async ({ pageWithProduct, inventoryPage }) => {
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('Test directamente en checkout', async ({ pageAtCheckout, checkoutPage }) => {
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    
    const step = await checkoutPage.getCurrentStep();
    expect(step).toBe('overview');
  });

});

test.describe('Beneficios de usar Fixtures', () => {

  /**
   * BENEFICIO 1: Menos código repetitivo
   * BENEFICIO 2: Fixtures con estado precargado
   * BENEFICIO 3: Tipado automático
   * BENEFICIO 4: Reutilización a nivel de proyecto
   */

  test('Ejemplo: Combinando fixtures', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.sortBy('lohi');
    
    const firstPrice = await inventoryPage.getFirstProductPrice();
    expect(firstPrice).toBe('$7.99');
  });

});
