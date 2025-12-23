// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 2: El Camino Feliz (Happy Path)
 * =====================================
 * El Happy Path es el flujo principal de la aplicación donde
 * todo sale bien. Es el primer candidato a automatizar.
 * 
 * Características de un buen Happy Path:
 * - Cubre el flujo de negocio más importante
 * - Tiene validaciones en CADA paso
 * - Es independiente (no depende de otros tests)
 * - Es idempotente (puede correrse múltiples veces)
 */

test.describe('Happy Path: Compra Completa en SauceDemo', () => {

  test('Flujo completo: Login → Producto → Carrito → Checkout → Confirmación', async ({ page }) => {
    
    // ═══════════════════════════════════════════════════════════════════
    // PASO 1: LOGIN
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Login con usuario válido', async () => {
      await page.goto('https://www.saucedemo.com/');
      
      // Verificar que estamos en la página de login
      await expect(page).toHaveTitle('Swag Labs');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
      
      // Ingresar credenciales
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      // Validar login exitoso
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 2: SELECCIONAR PRODUCTOS
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Agregar productos al carrito', async () => {
      // Agregar Sauce Labs Backpack
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      
      // Validar que se agregó (badge del carrito)
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
      
      // El botón cambió a "Remove"
      await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
      
      // Agregar otro producto
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      
      // Ahora hay 2 items
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 3: REVISAR CARRITO
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Ir al carrito y verificar productos', async () => {
      // Click en el carrito
      await page.locator('.shopping_cart_link').click();
      
      // Validar URL
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
      
      // Verificar que están los 2 productos
      const items = page.locator('[data-test="inventory-item"]');
      await expect(items).toHaveCount(2);
      
      // Verificar nombres de productos
      await expect(page.locator('[data-test="inventory-item-name"]').first()).toContainText('Sauce Labs Backpack');
      await expect(page.locator('[data-test="inventory-item-name"]').nth(1)).toContainText('Sauce Labs Bike Light');
      
      // Verificar precios individuales
      await expect(page.locator('[data-test="inventory-item-price"]').first()).toHaveText('$29.99');
      await expect(page.locator('[data-test="inventory-item-price"]').nth(1)).toHaveText('$9.99');
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 4: CHECKOUT - INFORMACIÓN
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Completar información de envío', async () => {
      // Iniciar checkout
      await page.locator('[data-test="checkout"]').click();
      
      // Validar página de información
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
      
      // Llenar formulario
      await page.locator('[data-test="firstName"]').fill('Juan');
      await page.locator('[data-test="lastName"]').fill('Pérez');
      await page.locator('[data-test="postalCode"]').fill('5000');
      
      // Verificar que los campos tienen los valores correctos
      await expect(page.locator('[data-test="firstName"]')).toHaveValue('Juan');
      await expect(page.locator('[data-test="lastName"]')).toHaveValue('Pérez');
      await expect(page.locator('[data-test="postalCode"]')).toHaveValue('5000');
      
      // Continuar
      await page.locator('[data-test="continue"]').click();
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 5: CHECKOUT - RESUMEN
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Revisar resumen de compra', async () => {
      // Validar página de resumen
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
      
      // Verificar productos en el resumen
      const items = page.locator('[data-test="inventory-item"]');
      await expect(items).toHaveCount(2);
      
      // Verificar información de pago
      await expect(page.locator('[data-test="payment-info-value"]')).toBeVisible();
      await expect(page.locator('[data-test="shipping-info-value"]')).toBeVisible();
      
      // Verificar totales
      const subtotal = page.locator('[data-test="subtotal-label"]');
      await expect(subtotal).toContainText('$39.98'); // 29.99 + 9.99
      
      const tax = page.locator('[data-test="tax-label"]');
      await expect(tax).toBeVisible();
      
      const total = page.locator('[data-test="total-label"]');
      await expect(total).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 6: FINALIZAR COMPRA
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Finalizar compra y verificar confirmación', async () => {
      // Click en Finish
      await page.locator('[data-test="finish"]').click();
      
      // Validar página de confirmación
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
      
      // Verificar mensaje de éxito
      const mensajeExito = page.locator('[data-test="complete-header"]');
      await expect(mensajeExito).toBeVisible();
      await expect(mensajeExito).toHaveText('Thank you for your order!');
      
      // Verificar descripción
      const descripcion = page.locator('[data-test="complete-text"]');
      await expect(descripcion).toContainText('Your order has been dispatched');
      
      // Verificar imagen de confirmación
      await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
      
      // Verificar botón para volver a productos
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 7: VOLVER AL INICIO (Cleanup/Reset)
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Volver a productos', async () => {
      await page.locator('[data-test="back-to-products"]').click();
      
      // Verificar que volvimos al inventario
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
      
      // El carrito debería estar vacío después de la compra
      await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });

  });

});

test.describe('Atomicidad: ¿Test largo o tests cortos?', () => {

  /**
   * ENFOQUE 1: Test largo (Happy Path completo)
   * Pros:
   * - Valida el flujo completo de negocio
   * - Detecta problemas de integración entre pasos
   * 
   * Contras:
   * - Si falla en el paso 5, hay que investigar todo
   * - Más lento de ejecutar
   * - Un fallo bloquea toda la validación
   */

  /**
   * ENFOQUE 2: Tests atómicos (uno por funcionalidad)
   * Pros:
   * - Fácil identificar qué falló
   * - Se pueden ejecutar en paralelo
   * - Más rápidos individualmente
   * 
   * Contras:
   * - Requieren setup repetido
   * - No validan la integración completa
   */

  // Ejemplo de test atómico: Solo login
  test('Atómico: Login exitoso', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  // Ejemplo de test atómico: Solo agregar al carrito (requiere login primero)
  test('Atómico: Agregar producto al carrito', async ({ page }) => {
    // Setup: Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Test: Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  /**
   * RECOMENDACIÓN:
   * - Tener UN test de Happy Path completo (smoke test / sanity check)
   * - Tener tests atómicos para cada funcionalidad
   * - Ejecutar el Happy Path en cada deploy
   * - Ejecutar tests atómicos para validación específica
   */

});
