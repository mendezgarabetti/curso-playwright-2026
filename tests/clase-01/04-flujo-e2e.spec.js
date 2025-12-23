// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 1: Flujo E2E Completo
 * ===========================
 * Un test End-to-End (E2E) simula el flujo completo
 * que haría un usuario real.
 * 
 * Este test cubre el "Happy Path" de una compra:
 * Login → Agregar producto → Carrito → Checkout → Confirmación
 */

test.describe('Flujo de Compra Completo (E2E)', () => {

  test('Happy Path: Compra exitosa de un producto', async ({ page }) => {
    // ══════════════════════════════════════════════════════════════════════
    // PASO 1: LOGIN
    // ══════════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verificación intermedia
    await expect(page).toHaveURL(/.*inventory.html/);

    // ══════════════════════════════════════════════════════════════════════
    // PASO 2: AGREGAR PRODUCTO AL CARRITO
    // ══════════════════════════════════════════════════════════════════════
    
    // Agregar la camiseta "Sauce Labs Bolt T-Shirt"
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Verificación intermedia
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // ══════════════════════════════════════════════════════════════════════
    // PASO 3: IR AL CARRITO
    // ══════════════════════════════════════════════════════════════════════
    
    // Nota: El carrito no tiene data-test, usamos clase CSS
    await page.locator('.shopping_cart_link').click();
    
    // Verificaciones del carrito
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);

    // ══════════════════════════════════════════════════════════════════════
    // PASO 4: INICIAR CHECKOUT
    // ══════════════════════════════════════════════════════════════════════
    await page.locator('[data-test="checkout"]').click();
    
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // ══════════════════════════════════════════════════════════════════════
    // PASO 5: LLENAR FORMULARIO DE ENVÍO
    // ══════════════════════════════════════════════════════════════════════
    await page.locator('[data-test="firstName"]').fill('Estudiante');
    await page.locator('[data-test="lastName"]').fill('QA');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continuar al resumen
    await page.locator('[data-test="continue"]').click();
    
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    // ══════════════════════════════════════════════════════════════════════
    // PASO 6: REVISAR RESUMEN Y FINALIZAR
    // ══════════════════════════════════════════════════════════════════════
    
    // Verificar que el producto está en el resumen
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    
    // Finalizar compra
    await page.locator('[data-test="finish"]').click();

    // ══════════════════════════════════════════════════════════════════════
    // PASO 7: VERIFICAR CONFIRMACIÓN
    // ══════════════════════════════════════════════════════════════════════
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    
    const mensajeFinal = page.locator('[data-test="complete-header"]');
    
    // Verificar que el mensaje de éxito es visible
    await expect(mensajeFinal).toBeVisible();
    
    // Verificar el texto exacto
    await expect(mensajeFinal).toHaveText('Thank you for your order!');
  });

});

test.describe('Variaciones del Happy Path', () => {

  test.beforeEach(async ({ page }) => {
    // Setup común: Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Compra de múltiples productos', async ({ page }) => {
    // Agregar varios productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Verificar que el carrito tiene 3
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    
    // Verificar los 3 productos
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
    
    // Completar checkout
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('99999');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    
    // Verificar éxito
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('Agregar y quitar productos del carrito', async ({ page }) => {
    // Agregar un producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Quitar el producto
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // El badge ya no debería existir
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

  test('Cancelar checkout y volver a productos', async ({ page }) => {
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    
    // Volver a productos desde el carrito
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verificar que volvimos
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // El producto sigue en el carrito
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});
