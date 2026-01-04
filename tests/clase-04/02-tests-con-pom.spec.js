// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';

/**
 * CLASE 4: Tests de Ejemplo con Page Objects
 * ==========================================
 */

test.describe('Autenticación', () => {

  test('Login con usuario estándar', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login con usuario bloqueado muestra error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsLockedUser();
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('Login con credenciales vacías muestra error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('', '');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

});

test.describe('Inventario', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('Página muestra 6 productos', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('Ordenar productos por precio (bajo a alto)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.sortBy('lohi');
    
    const firstPrice = await inventoryPage.getFirstProductPrice();
    expect(firstPrice).toBe('$7.99');
  });

  test('Agregar múltiples productos al carrito', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.addMultipleToCart([
      'sauce-labs-backpack',
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt'
    ]);
    
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(3);
  });

});

test.describe('Carrito', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
  });

  test('Carrito muestra productos agregados', async ({ page }) => {
    const cartPage = new CartPage(page);
    
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);
    
    const names = await cartPage.getAllItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('Eliminar producto del carrito', async ({ page }) => {
    const cartPage = new CartPage(page);
    
    await cartPage.removeItem('sauce-labs-backpack');
    
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

});

test.describe('Happy Path Completo con POM', () => {

  test('Flujo E2E: Login → Productos → Carrito → Checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.loginAsStandardUser();
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    await test.step('Agregar productos', async () => {
      await inventoryPage.addMultipleToCart([
        'sauce-labs-backpack',
        'sauce-labs-bike-light'
      ]);
      const count = await inventoryPage.getCartCount();
      expect(count).toBe(2);
    });

    await test.step('Verificar carrito', async () => {
      await inventoryPage.goToCart();
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBe(2);
    });

    await test.step('Completar checkout', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillInformation({
        firstName: 'Juan',
        lastName: 'Pérez',
        postalCode: '5000'
      });
      await checkoutPage.continue();
    });

    await test.step('Finalizar compra', async () => {
      await checkoutPage.finish();
      const isComplete = await checkoutPage.isOrderComplete();
      expect(isComplete).toBe(true);
    });
  });

});
