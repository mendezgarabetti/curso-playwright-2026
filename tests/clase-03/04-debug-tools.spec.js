// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 3: Herramientas de Debugging
 * ==================================
 * Playwright ofrece varias formas de depurar tests.
 */

test.describe('page.pause() - Pausa Interactiva', () => {

  test('Usar pause para inspeccionar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Descomentar para pausar aquí:
    // await page.pause();
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // await page.pause(); // Otra pausa para ver el formulario lleno
    
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('console.log() - Logs Tradicionales', () => {

  test('Debug con console.log', async ({ page }) => {
    console.log('🚀 Iniciando test de login');
    
    await page.goto('https://www.saucedemo.com/');
    console.log('📍 Página cargada:', page.url());
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    console.log('✏️ Credenciales ingresadas');
    
    await page.locator('[data-test="login-button"]').click();
    console.log('🖱️ Click en login');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    console.log('✅ Login exitoso, URL:', page.url());
  });

  test('Debug de valores dinámicos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    const precios = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    console.log('📍 Precios encontrados:', precios);
    
    const nombres = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    console.log('📍 Nombres de productos:', nombres);
    
    const tieneMochila = nombres.some(n => n.includes('Backpack'));
    console.log('📍 ¿Tiene Backpack?:', tieneMochila);
    
    expect(tieneMochila).toBe(true);
  });

});

test.describe('Screenshots Manuales', () => {

  test('Tomar screenshots en puntos clave', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.screenshot({ 
      path: 'test-results/debug/01-login-page.png',
      fullPage: true 
    });
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await page.screenshot({ 
      path: 'test-results/debug/02-inventory-page.png',
      fullPage: true 
    });
    
    // Screenshot de un elemento específico
    const primerProducto = page.locator('[data-test="inventory-item"]').first();
    await primerProducto.screenshot({ 
      path: 'test-results/debug/03-primer-producto.png' 
    });
  });

});

test.describe('Modo Debug (--debug)', () => {

  /**
   * Para usar el modo debug:
   * npx playwright test --debug
   * 
   * Esto abre:
   * - El navegador en modo visible
   * - El Inspector de Playwright
   * - Permite ejecutar paso a paso
   */

  test('Test para ejecutar con --debug', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

test.describe('Modo UI (--ui)', () => {

  /**
   * Para usar el modo UI:
   * npx playwright test --ui
   * 
   * Características:
   * - Interfaz visual completa
   * - Timeline de acciones
   * - DOM snapshots
   * - Filtros de tests
   */

  test('Test para ejecutar con --ui', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

});
