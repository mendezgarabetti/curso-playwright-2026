// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO CLASE 2: Aserciones                                        ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Objetivo: Agregar aserciones en cada paso del flujo                  ║
 * ║                                                                       ║
 * ║  Requisitos:                                                          ║
 * ║  - Mínimo 8 aserciones                                                ║
 * ║  - Usar al menos 4 tipos diferentes de aserciones                     ║
 * ║  - Completar todos los TODO                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('EJERCICIO: Agregar Aserciones al Flujo', () => {

  test('Flujo de compra con validaciones', async ({ page }) => {
    
    // ═══════════════════════════════════════════════════════════════════
    // PASO 1: Ir a la página de login
    // ═══════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    
    // TODO: Verificar que la URL es correcta
    // await expect(page).toHaveURL(???);
    
    // TODO: Verificar que el título de la página es "Swag Labs"
    // await expect(page).toHaveTitle(???);

    // ═══════════════════════════════════════════════════════════════════
    // PASO 2: Hacer login
    // ═══════════════════════════════════════════════════════════════════
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // TODO: Verificar que llegamos a la página de inventario
    // await expect(page).toHaveURL(???);
    
    // TODO: Verificar que el título dice "Products"
    // await expect(???).toHaveText(???);

    // ═══════════════════════════════════════════════════════════════════
    // PASO 3: Verificar la página de productos
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Verificar que hay exactamente 6 productos
    // await expect(???).toHaveCount(???);
    
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

/**
 * CRITERIOS DE ÉXITO:
 * 
 * ✅ Mínimo 8 aserciones completadas
 * ✅ Usar al menos 4 tipos diferentes:
 *    - toHaveURL()
 *    - toHaveTitle()
 *    - toHaveText() / toContainText()
 *    - toBeVisible()
 *    - toHaveCount()
 * ✅ Todos los tests pasan en verde
 * ✅ No hay TODO pendientes
 * 
 * BONUS:
 * ✅ Convertir el segundo test a soft assertions
 */
