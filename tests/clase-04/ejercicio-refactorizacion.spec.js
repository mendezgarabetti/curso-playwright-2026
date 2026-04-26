// @ts-check
import { test, expect } from './fixtures.js';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO: Refactorización a Page Object Model                       ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Objetivo: Convertir estos tests para que usen Page Objects           ║
 * ║                                                                       ║
 * ║  Instrucciones:                                                       ║
 * ║  1. Estudiar los Page Objects en la carpeta ./pages/                  ║
 * ║  2. Refactorizar cada test para usar los Page Objects                 ║
 * ║  3. El test debe seguir funcionando igual                             ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

// TODO: Descomentar esta línea cuando empieces a refactorizar
//import { LoginPage } from './pages/LoginPage.js';
// import { InventoryPage } from './pages/InventoryPage.js';
// import { CartPage } from './pages/CartPage.js';
// import { CheckoutPage } from './pages/CheckoutPage.js';
// PUEDE USARSE INDEX.JS

import { LoginPage, InventoryPage } from './pages/index.js';

test.describe('EJERCICIO: Refactorizar estos tests', () => {

  test('Test 1: Login y verificar productos - REFACTORIZAR', async ({ loginPage }) => {
    const elementoLogin = loginPage.obtenerSelectorLogin();
    loginAccionPage.iniciarLogin(elementoLogin());
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();

    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
    
    const inventoryPage = new InventoryPage(loginPage.page);
    const cantidadProductos = await inventoryPage.getProductCount();
    expect(cantidadProductos).toBe(6);
  });

  test('Test 2: Agregar múltiples productos - REFACTORIZAR', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await expect(page).toHaveURL(/.*inventory.html/);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addMultipleToCart([
      'sauce-labs-backpack',
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt'
    ]);

    const cantidadProductosCarrito = await inventoryPage.getCartCount();
    expect(cantidadProductosCarrito).toBe(3);
  });

  test('Test 3: Ordenar por precio - REFACTORIZAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');

    // TODO: Usar inventoryPage.sortBy() y getFirstProductPrice()
  });

  test('Test 4: Flujo de carrito - REFACTORIZAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);

    // TODO: Usar cartPage.removeItem() e isCartEmpty()
  });

  test('Test 5: Checkout completo - REFACTORIZAR', async ({ page }) => {
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

    // TODO: Usar todos los Page Objects y test.step()
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * ✅ Todos los tests pasan en verde
 * ✅ No hay selectores hardcodeados
 * ✅ Se usan métodos de los Page Objects
 * ✅ El código es más legible
 */
