// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 3: Trace Viewer - Viaje en el Tiempo
 * ==========================================
 * El Trace Viewer es la herramienta de "análisis forense" de Playwright.
 * Captura TODO lo que pasa durante el test:
 * - Screenshots en cada paso
 * - Estado del DOM
 * - Llamadas de red (requests/responses)
 * - Consola del navegador
 * - Tiempo de cada acción
 * 
 * Configuración en playwright.config.js:
 *   trace: 'on'              // Siempre captura
 *   trace: 'off'             // Nunca captura
 *   trace: 'on-first-retry'  // Solo en reintentos
 *   trace: 'retain-on-failure' // Solo guarda si falla (RECOMENDADO)
 */

test.describe('Trace Viewer: Capturando Evidencia', () => {

  test('Test exitoso con trace completo', async ({ page }) => {
    // Este test genera un trace que podemos analizar
    await page.goto('https://www.saucedemo.com/');
    
    // Cada acción queda registrada en el trace
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Validaciones también quedan en el trace
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Test que FALLA intencionalmente (para ver trace)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Esta aserción FALLARÁ - el título dice "Products", no "Inventario"
    // El trace mostrará exactamente el estado de la página cuando falló
    await expect(page.locator('[data-test="title"]')).toHaveText('Inventario', {
      timeout: 3000 // Reducimos timeout para que falle rápido
    });
  });

});

test.describe('Información en el Trace', () => {

  test('Navegación con múltiples páginas', async ({ page }) => {
    // El trace captura cada navegación
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
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);
    
    // En el trace veremos cada navegación con su screenshot
  });

  test('Interacciones de red visibles en trace', async ({ page }) => {
    // Aunque SauceDemo no hace llamadas API visibles,
    // en una app real veríamos todas las requests/responses
    
    await page.goto('https://www.saucedemo.com/');
    
    // El trace captura:
    // - Request al HTML
    // - CSS, JS, imágenes
    // - Cualquier XHR/Fetch
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('Cómo Ver el Trace', () => {

  /**
   * OPCIÓN 1: Desde el reporte HTML
   * 1. Ejecutar: npx playwright test
   * 2. Abrir: npx playwright show-report
   * 3. Click en un test fallido
   * 4. Click en "Traces" → Se abre Trace Viewer
   * 
   * OPCIÓN 2: Desde archivo .zip
   * 1. Los traces se guardan en test-results/
   * 2. Ejecutar: npx playwright show-trace test-results/xxx/trace.zip
   * 
   * OPCIÓN 3: Modo UI
   * 1. Ejecutar: npx playwright test --ui
   * 2. El trace se muestra integrado
   */

  test('Ejecutame y luego mirá el trace', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Simular un flujo completo
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar varios productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    
    // Checkout
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Finalizar
    await page.locator('[data-test="finish"]').click();
    
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    
    // Ahora ejecutá:
    // npx playwright show-report
    // y explorá el trace de este test
  });

});
