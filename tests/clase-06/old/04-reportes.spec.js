// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 6: Reportes y Evidencias
 * ==============================
 * Playwright genera automáticamente:
 * - Reporte HTML interactivo
 * - Screenshots en caso de fallo
 * - Videos de ejecución
 * - Traces para debugging
 * 
 * Configuración en playwright.config.js:
 *   reporter: [['html'], ['json'], ['junit']]
 *   use: {
 *     screenshot: 'only-on-failure',
 *     video: 'retain-on-failure',
 *     trace: 'retain-on-failure'
 *   }
 */

test.describe('Generación de Evidencias', () => {

  test('Test exitoso con screenshots manuales', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Screenshot manual en punto específico
    await page.screenshot({ 
      path: 'test-results/evidencias/01-login-page.png',
      fullPage: true 
    });
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Screenshot después del login
    await page.screenshot({ 
      path: 'test-results/evidencias/02-inventory.png',
      fullPage: true 
    });
  });

  test('Test con anotaciones en el reporte', async ({ page }) => {
    // Las anotaciones aparecen en el reporte HTML
    test.info().annotations.push({
      type: 'issue',
      description: 'JIRA-123: Bug relacionado'
    });
    
    test.info().annotations.push({
      type: 'requirement',
      description: 'REQ-456: Requisito de login'
    });
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Test con attachments personalizados', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Adjuntar screenshot al reporte
    const screenshot = await page.screenshot();
    await test.info().attach('screenshot-inventario', {
      body: screenshot,
      contentType: 'image/png'
    });
    
    // Adjuntar datos de prueba al reporte
    const testData = {
      usuario: 'standard_user',
      productos: 6,
      timestamp: new Date().toISOString()
    };
    await test.info().attach('datos-de-prueba', {
      body: JSON.stringify(testData, null, 2),
      contentType: 'application/json'
    });
    
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('Test con steps detallados', async ({ page }) => {
    await test.step('Navegar a la página de login', async () => {
      await page.goto('https://www.saucedemo.com/');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    await test.step('Ingresar credenciales', async () => {
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
    });

    await test.step('Hacer click en login', async () => {
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('Verificar redirección exitosa', async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });
  });

});

test.describe('Tests que Generan Evidencias de Fallo', () => {

  test('Test que falla (para ver screenshot automático)', async ({ page }) => {
    test.skip(true, 'Descomentar para ver screenshot de fallo');
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Esta aserción FALLA - el título no es "Inventario"
    await expect(page.locator('[data-test="title"]')).toHaveText('Inventario');
    // Playwright tomará screenshot automáticamente
  });

});

test.describe('Comparación Visual (Screenshots)', () => {

  test('Comparación visual de la página de login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Comparar con screenshot baseline
    // La primera vez crea el baseline, las siguientes compara
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 100,  // Tolerancia de píxeles diferentes
      threshold: 0.2       // Tolerancia de diferencia de color (0-1)
    });
  });

  test('Comparación visual de elemento específico', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Comparar solo el formulario de login
    const loginForm = page.locator('#login_button_container');
    await expect(loginForm).toHaveScreenshot('login-form.png');
  });

});

test.describe('Información del Reporte', () => {

  test('Agregar metadata al test', async ({ page }) => {
    // Agregar tags/etiquetas
    test.info().annotations.push({ type: 'tag', description: 'smoke' });
    test.info().annotations.push({ type: 'tag', description: 'login' });
    test.info().annotations.push({ type: 'tag', description: 'priority-high' });
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// COMANDOS PARA VER REPORTES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * COMANDOS DE REPORTES:
 * 
 * Ver reporte HTML:
 *   npx playwright show-report
 * 
 * Generar reporte después de ejecutar:
 *   npx playwright test
 *   npx playwright show-report
 * 
 * Especificar carpeta de reporte:
 *   npx playwright show-report ./mi-reporte
 * 
 * El reporte HTML incluye:
 * - Resumen de tests (passed/failed/skipped)
 * - Tiempo de ejecución
 * - Screenshots de fallos
 * - Videos (si están habilitados)
 * - Traces (si están habilitados)
 * - Steps detallados
 * - Attachments personalizados
 */
