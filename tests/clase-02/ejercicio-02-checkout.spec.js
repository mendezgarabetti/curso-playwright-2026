// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * EJERCICIO 2: Completar el Flujo de Checkout
 * ============================================
 * Este test tiene el inicio y el final, pero falta la parte del medio.
 * Tu tarea es completar los pasos marcados con // TODO
 * 
 * Criterios de éxito:
 * - Completar todos los pasos del checkout
 * - Agregar validaciones en cada paso
 * - El test debe finalizar con el mensaje "Thank you for your order!"
 */

test.describe('EJERCICIO: Completar Checkout', () => {

  test('Compra de múltiples productos - COMPLETAR', async ({ page }) => {
    
    // ═══════════════════════════════════════════════════════════════════
    // SETUP: Login (ya completado)
    // ═══════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // ═══════════════════════════════════════════════════════════════════
    // TODO PASO 1: Agregar 3 productos al carrito
    // ═══════════════════════════════════════════════════════════════════
    // Productos disponibles:
    // - add-to-cart-sauce-labs-backpack
    // - add-to-cart-sauce-labs-bike-light
    // - add-to-cart-sauce-labs-bolt-t-shirt
    // - add-to-cart-sauce-labs-fleece-jacket
    // - add-to-cart-sauce-labs-onesie
    // - add-to-cart-test.allthethings()-t-shirt-(red)
    
    // Tu código aquí:
    // await page.locator('[data-test="???"]').click();
    // await page.locator('[data-test="???"]').click();
    // await page.locator('[data-test="???"]').click();
    
    // TODO: Verificar que el badge muestra "3"
    // await expect(???).toHaveText('3');

    // ═══════════════════════════════════════════════════════════════════
    // TODO PASO 2: Ir al carrito y verificar productos
    // ═══════════════════════════════════════════════════════════════════
    
    // Tu código aquí:
    // await page.locator('???').click();
    
    // TODO: Verificar URL del carrito
    // await expect(page).toHaveURL(???);
    
    // TODO: Verificar que hay 3 items
    // await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(???);

    // ═══════════════════════════════════════════════════════════════════
    // TODO PASO 3: Iniciar Checkout
    // ═══════════════════════════════════════════════════════════════════
    
    // Tu código aquí:
    // await page.locator('[data-test="???"]').click();
    
    // TODO: Verificar que estamos en la página de información
    // await expect(page.locator('[data-test="title"]')).toHaveText('???');

    // ═══════════════════════════════════════════════════════════════════
    // TODO PASO 4: Llenar información de envío
    // ═══════════════════════════════════════════════════════════════════
    
    // Tu código aquí:
    // await page.locator('[data-test="firstName"]').fill('???');
    // await page.locator('[data-test="lastName"]').fill('???');
    // await page.locator('[data-test="postalCode"]').fill('???');
    
    // Tu código aquí para continuar:
    // await page.locator('[data-test="???"]').click();

    // ═══════════════════════════════════════════════════════════════════
    // TODO PASO 5: Verificar resumen
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Verificar que estamos en checkout overview
    // await expect(page).toHaveURL(???);
    
    // TODO: Verificar que se muestra el subtotal
    // const subtotal = page.locator('[data-test="subtotal-label"]');
    // await expect(subtotal).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // TODO PASO 6: Finalizar compra
    // ═══════════════════════════════════════════════════════════════════
    
    // Tu código aquí:
    // await page.locator('[data-test="???"]').click();

    // ═══════════════════════════════════════════════════════════════════
    // VERIFICACIÓN FINAL (ya completado)
    // ═══════════════════════════════════════════════════════════════════
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    
    console.log('🎉 ¡Felicidades! Completaste el ejercicio correctamente.');
  });

});

test.describe('EJERCICIO BONUS: Validación de Errores', () => {

  test('Intentar checkout sin llenar campos - COMPLETAR', async ({ page }) => {
    // Setup
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // TODO: Intentar continuar sin llenar ningún campo
    // await page.locator('[data-test="continue"]').click();
    
    // TODO: Verificar que aparece error de "First Name is required"
    // const error = page.locator('[data-test="error"]');
    // await expect(error).toBeVisible();
    // await expect(error).toContainText('???');
    
    // TODO: Llenar solo el nombre y verificar el siguiente error
    // await page.locator('[data-test="firstName"]').fill('Juan');
    // await page.locator('[data-test="continue"]').click();
    // await expect(error).toContainText('???');
    
    // TODO: Llenar apellido y verificar el siguiente error
    // await page.locator('[data-test="lastName"]').fill('Pérez');
    // await page.locator('[data-test="continue"]').click();
    // await expect(error).toContainText('???');
    
    // TODO: Finalmente llenar código postal y verificar que avanza
    // await page.locator('[data-test="postalCode"]').fill('5000');
    // await page.locator('[data-test="continue"]').click();
    // await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

});

test.describe('EJERCICIO EXTRA: Usar test.step()', () => {

  test('Organizar el flujo con test.step() - COMPLETAR', async ({ page }) => {
    /**
     * test.step() permite agrupar pasos y verlos en el reporte.
     * Convierte este test para usar test.step() en cada sección.
     * 
     * Ejemplo:
     * await test.step('Nombre del paso', async () => {
     *   // código del paso
     * });
     */

    // TODO: Envolver en test.step('Login', async () => { ... })
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // TODO: Envolver en test.step('Agregar producto', async () => { ... })
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // TODO: Envolver en test.step('Verificar carrito', async () => { ... })
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  });

});
