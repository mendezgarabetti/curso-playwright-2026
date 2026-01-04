// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 2: Happy Path - Flujo de Checkout Completo
 * ================================================
 * Un "Happy Path" es el flujo ideal donde todo funciona bien.
 * Este test demuestra un flujo E2E completo con validaciones
 * en cada paso.
 * 
 * Flujo: Login → Productos → Carrito → Checkout → Confirmación
 */

test.describe('Happy Path: Compra Completa con Validaciones', () => {

  test('Flujo completo de compra de un producto', async ({ page }) => {
    
    // ═══════════════════════════════════════════════════════════════════
    // PASO 1: LOGIN
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Login con usuario estándar', async () => {
      await page.goto('https://www.saucedemo.com/');
      
      // Verificar que estamos en la página de login
      await expect(page).toHaveTitle('Swag Labs');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
      
      // Realizar login
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      // Verificar login exitoso
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 2: SELECCIONAR PRODUCTO
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Seleccionar producto y agregarlo al carrito', async () => {
      // Verificar que hay productos disponibles
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
      
      // Verificar el producto que vamos a agregar
      const backpack = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
      await expect(backpack).toBeVisible();
      await expect(backpack.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
      
      // Agregar al carrito
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      
      // Verificar que se agregó
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
      await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 3: IR AL CARRITO
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Navegar al carrito y verificar contenido', async () => {
      await page.locator('.shopping_cart_link').click();
      
      // Verificar que estamos en el carrito
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
      
      // Verificar el producto en el carrito
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
      await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
      await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
      await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 4: INICIAR CHECKOUT
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Iniciar proceso de checkout', async () => {
      await page.locator('[data-test="checkout"]').click();
      
      // Verificar que estamos en el formulario de checkout
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
      
      // Verificar que los campos están vacíos
      await expect(page.locator('[data-test="firstName"]')).toBeEmpty();
      await expect(page.locator('[data-test="lastName"]')).toBeEmpty();
      await expect(page.locator('[data-test="postalCode"]')).toBeEmpty();
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 5: LLENAR FORMULARIO DE ENVÍO
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Completar información de envío', async () => {
      // Llenar formulario
      await page.locator('[data-test="firstName"]').fill('Estudiante');
      await page.locator('[data-test="lastName"]').fill('QA');
      await page.locator('[data-test="postalCode"]').fill('12345');
      
      // Verificar que se llenaron correctamente
      await expect(page.locator('[data-test="firstName"]')).toHaveValue('Estudiante');
      await expect(page.locator('[data-test="lastName"]')).toHaveValue('QA');
      await expect(page.locator('[data-test="postalCode"]')).toHaveValue('12345');
      
      // Continuar
      await page.locator('[data-test="continue"]').click();
      
      // Verificar que avanzamos al resumen
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 6: REVISAR RESUMEN
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Verificar resumen del pedido', async () => {
      // Verificar producto en resumen
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
      await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
      
      // Verificar totales
      await expect(page.locator('[data-test="subtotal-label"]')).toContainText('$29.99');
      await expect(page.locator('[data-test="tax-label"]')).toBeVisible();
      await expect(page.locator('[data-test="total-label"]')).toBeVisible();
      
      // Verificar información de envío
      await expect(page.locator('[data-test="shipping-info-value"]')).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════
    // PASO 7: FINALIZAR COMPRA
    // ═══════════════════════════════════════════════════════════════════
    await test.step('Finalizar compra y verificar confirmación', async () => {
      await page.locator('[data-test="finish"]').click();
      
      // Verificar página de confirmación
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
      
      // Verificar mensaje de éxito
      await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
      await expect(page.locator('[data-test="complete-text"]')).toBeVisible();
      
      // Verificar que el carrito está vacío
      await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });

  });

});

test.describe('Happy Path: Compra de Múltiples Productos', () => {

  test('Comprar 3 productos diferentes', async ({ page }) => {
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar 3 productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Verificar carrito
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
    
    // Checkout
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('99999');
    await page.locator('[data-test="continue"]').click();
    
    // Verificar subtotal (suma de los 3 productos)
    // Backpack: $29.99, Bike Light: $9.99, T-Shirt: $15.99 = $55.97
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('$55.97');
    
    // Finalizar
    await page.locator('[data-test="finish"]').click();
    
    // Verificar éxito
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

});

test.describe('Validaciones de Negocio', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('No se puede hacer checkout con carrito vacío', async ({ page }) => {
    // Ir al carrito vacío
    await page.locator('.shopping_cart_link').click();
    
    // Verificar que el carrito está vacío
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    
    // El botón de checkout debería estar presente pero...
    // (SauceDemo permite hacer checkout vacío, pero una app real no debería)
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('Se pueden quitar productos del carrito', async ({ page }) => {
    // Agregar productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    
    // Quitar uno
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Quitar el otro
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

});
