// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 6: Tests Multi-Navegador
 * ==============================
 * Estos tests se ejecutan en múltiples navegadores automáticamente
 * según la configuración de "projects" en playwright.config.js
 * 
 * Comandos:
 *   npx playwright test --project=chromium
 *   npx playwright test --project=firefox
 *   npx playwright test --project=webkit
 *   npx playwright test  (ejecuta todos los projects)
 */

test.describe('Tests Cross-Browser', () => {

  test('Login funciona en todos los navegadores', async ({ page, browserName }) => {
    // browserName nos dice en qué navegador estamos
    console.log(`🌐 Ejecutando en: ${browserName}`);
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('Navegación funciona correctamente', async ({ page, browserName }) => {
    console.log(`🌐 Navegación en: ${browserName}`);
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Navegar a detalle de producto
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item.html/);
    
    // Volver
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Carrito funciona en todos los navegadores', async ({ page, browserName }) => {
    console.log(`🛒 Carrito en: ${browserName}`);
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verificar badge
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
  });

});

test.describe('Tests con Condiciones por Navegador', () => {

  test('Comportamiento específico por navegador', async ({ page, browserName }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Ejemplo: diferentes expectativas por navegador
    if (browserName === 'webkit') {
      console.log('🍎 Safari/WebKit detectado');
      // Safari puede tener comportamientos diferentes
    } else if (browserName === 'firefox') {
      console.log('🦊 Firefox detectado');
    } else {
      console.log('🌐 Chromium detectado');
    }
    
    // Test común a todos
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test.skip('Test que solo corre en Chromium', async ({ page, browserName }) => {
    // Este test se puede saltar condicionalmente
    test.skip(browserName !== 'chromium', 'Solo para Chromium');
    
    await page.goto('https://www.saucedemo.com/');
    // ... test específico de Chromium
  });

});

test.describe('Información del Navegador', () => {

  test('Obtener información del contexto', async ({ page, browser, browserName }) => {
    console.log('═══════════════════════════════════════');
    console.log(`Navegador: ${browserName}`);
    console.log(`Browser Version: ${browser.version()}`);
    console.log('═══════════════════════════════════════');
    
    await page.goto('https://www.saucedemo.com/');
    
    // Obtener User Agent
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`User Agent: ${userAgent}`);
    
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});
