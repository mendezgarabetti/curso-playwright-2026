// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO: Refactorización a Page Object Model                       ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Tu misión: Convertir estos tests para que usen Page Objects          ║
 * ║                                                                       ║
 * ║  Instrucciones:                                                       ║
 * ║  1. Estudiar los Page Objects en la carpeta ./pages/                  ║
 * ║  2. Refactorizar cada test para usar los Page Objects                 ║
 * ║  3. El test debe seguir funcionando igual (mismas verificaciones)     ║
 * ║  4. El código debe ser más legible y mantenible                       ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

// TODO: Descomentar esta línea cuando empieces a refactorizar
// const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('./pages');

test.describe('EJERCICIO: Refactorizar estos tests', () => {

  test('Test 1: Login y verificar productos - REFACTORIZAR', async ({ page }) => {
    // ════════════════════════════════════════════════════════════════
    // CÓDIGO ACTUAL (sin POM)
    // ════════════════════════════════════════════════════════════════
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(6);

    // ════════════════════════════════════════════════════════════════
    // TODO: Reescribir usando LoginPage e InventoryPage
    // ════════════════════════════════════════════════════════════════
    
    // const loginPage = new LoginPage(page);
    // const inventoryPage = new InventoryPage(page);
    // 
    // await loginPage.goto();
    // await loginPage.loginAsStandardUser();
    // await expect(page).toHaveURL(/.*inventory.html/);
    // 
    // const count = await inventoryPage.getProductCount();
    // expect(count).toBe(6);
  });

  test('Test 2: Agregar múltiples productos - REFACTORIZAR', async ({ page }) => {
    // ════════════════════════════════════════════════════════════════
    // CÓDIGO ACTUAL (sin POM)
    // ════════════════════════════════════════════════════════════════
    
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Verificar
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');

    // ════════════════════════════════════════════════════════════════
    // TODO: Reescribir usando Page Objects
    // PISTA: Usar inventoryPage.addMultipleToCart([...])
    // ════════════════════════════════════════════════════════════════
  });

  test('Test 3: Ordenar por precio - REFACTORIZAR', async ({ page }) => {
    // ════════════════════════════════════════════════════════════════
    // CÓDIGO ACTUAL (sin POM)
    // ════════════════════════════════════════════════════════════════
    
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Ordenar por precio bajo a alto
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    
    // Verificar primer precio
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');

    // ════════════════════════════════════════════════════════════════
    // TODO: Reescribir usando Page Objects
    // PISTA: Usar inventoryPage.sortBy('lohi')
    // ════════════════════════════════════════════════════════════════
  });

  test('Test 4: Flujo de carrito - REFACTORIZAR', async ({ page }) => {
    // ════════════════════════════════════════════════════════════════
    // CÓDIGO ACTUAL (sin POM)
    // ════════════════════════════════════════════════════════════════
    
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    
    // Verificar que estamos en el carrito
    await expect(page).toHaveURL(/.*cart.html/);
    
    // Verificar que el producto está
    const itemName = page.locator('[data-test="inventory-item-name"]');
    await expect(itemName).toContainText('Sauce Labs Backpack');
    
    // Remover producto
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // Verificar que el carrito está vacío
    const items = page.locator('[data-test="inventory-item"]');
    await expect(items).toHaveCount(0);

    // ════════════════════════════════════════════════════════════════
    // TODO: Reescribir usando LoginPage, InventoryPage y CartPage
    // ════════════════════════════════════════════════════════════════
  });

  test('Test 5: Checkout completo - REFACTORIZAR', async ({ page }) => {
    // ════════════════════════════════════════════════════════════════
    // CÓDIGO ACTUAL (sin POM) - Este es el más largo
    // ════════════════════════════════════════════════════════════════
    
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    
    // Iniciar checkout
    await page.locator('[data-test="checkout"]').click();
    
    // Llenar formulario
    await page.locator('[data-test="firstName"]').fill('Juan');
    await page.locator('[data-test="lastName"]').fill('Pérez');
    await page.locator('[data-test="postalCode"]').fill('5000');
    await page.locator('[data-test="continue"]').click();
    
    // Verificar resumen
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    const subtotal = page.locator('[data-test="subtotal-label"]');
    await expect(subtotal).toContainText('$29.99');
    
    // Finalizar
    await page.locator('[data-test="finish"]').click();
    
    // Verificar confirmación
    const mensaje = page.locator('[data-test="complete-header"]');
    await expect(mensaje).toHaveText('Thank you for your order!');

    // ════════════════════════════════════════════════════════════════
    // TODO: Reescribir usando TODOS los Page Objects
    // Este test debería usar: LoginPage, InventoryPage, CartPage, CheckoutPage
    // ════════════════════════════════════════════════════════════════
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * 
 * ✅ Todos los tests pasan en verde
 * ✅ No hay selectores hardcodeados en los tests (están en Page Objects)
 * ✅ El código es más legible
 * ✅ Se usan los métodos de los Page Objects
 * 
 * BONUS:
 * - Usar test.step() para organizar el flujo
 * - Usar los fixtures personalizados de fixtures.js
 */
