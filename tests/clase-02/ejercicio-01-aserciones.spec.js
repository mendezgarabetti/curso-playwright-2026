// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * EJERCICIO 1: Agregar Aserciones
 * ================================
 * Este test navega por SauceDemo pero NO tiene aserciones.
 * Tu tarea es agregar aserciones donde dice // TODO
 * 
 * Criterios de éxito:
 * - Mínimo 8 aserciones
 * - Usar al menos 4 tipos diferentes de expect (toBeVisible, toHaveText, toHaveURL, etc.)
 * - El test debe pasar en verde
 */

test.describe('EJERCICIO: Agregar Aserciones', () => {

  test('Flujo de login y navegación - AGREGAR ASERCIONES', async ({ page }) => {
    
    // ═══════════════════════════════════════════════════════════════════
    // PASO 1: Ir a la página de login
    // ═══════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    
    // TODO: Verificar que el título de la página es "Swag Labs"
    // await expect(page).toHaveTitle(???);
    
    // TODO: Verificar que el botón de login está visible
    // await expect(???).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // PASO 2: Hacer login
    // ═══════════════════════════════════════════════════════════════════
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // TODO: Verificar que el campo username tiene el valor "standard_user"
    // await expect(???).toHaveValue(???);
    
    await page.locator('[data-test="login-button"]').click();
    
    // TODO: Verificar que la URL contiene "inventory.html"
    // await expect(page).toHaveURL(???);
    
    // TODO: Verificar que el título de la página dice "Products"
    // await expect(???).toHaveText(???);

    // ═══════════════════════════════════════════════════════════════════
    // PASO 3: Verificar productos
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Verificar que hay exactamente 6 productos
    // const productos = page.locator('[data-test="inventory-item"]');
    // await expect(productos).toHaveCount(???);
    
    // TODO: Verificar que el dropdown de ordenamiento está visible
    // await expect(???).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // PASO 4: Agregar producto al carrito
    // ═══════════════════════════════════════════════════════════════════
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // TODO: Verificar que el badge del carrito muestra "1"
    // await expect(???).toHaveText(???);
    
    // TODO: Verificar que el botón cambió a "Remove"
    // await expect(???).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // PASO 5: Ir al carrito
    // ═══════════════════════════════════════════════════════════════════
    await page.locator('.shopping_cart_link').click();
    
    // TODO: Verificar que estamos en la página del carrito
    // await expect(page).toHaveURL(???);
    
    // TODO: Verificar que el producto "Sauce Labs Backpack" está en el carrito
    // await expect(???).toContainText(???);

  });

});

test.describe('EJERCICIO BONUS: Soft Assertions', () => {

  test('Verificar página de inventario con soft assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // TODO: Convertir estas aserciones a soft assertions
    // para ver TODOS los fallos en el reporte
    
    // Header
    await expect(page.locator('.app_logo')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    
    // Productos
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    
    // Footer
    await expect(page.locator('.footer')).toBeVisible();
    
    // PISTA: Cambia expect() por expect.soft()
  });

});
