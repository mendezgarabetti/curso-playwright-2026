// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 2: Auto-Wait en Playwright
 * ================================
 * Playwright espera AUTOMÁTICAMENTE antes de cada acción.
 * No necesitamos sleep() ni waitFor() en la mayoría de casos.
 * 
 * Antes de hacer click, fill, etc., Playwright verifica:
 * - ¿El elemento es VISIBLE?
 * - ¿Está HABILITADO (enabled)?
 * - ¿Está ESTABLE (no se está moviendo)?
 * - ¿Es RECEPTIVO a eventos (no hay otro elemento encima)?
 */

test.describe('Auto-Wait: Cómo Playwright espera por nosotros', () => {

  test('Login sin necesidad de waits explícitos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Playwright espera automáticamente a que estos elementos estén listos
    // No necesitamos: await page.waitForSelector('[data-test="username"]')
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Esta aserción también tiene auto-retry (espera hasta 5 segundos por defecto)
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Navegación entre páginas - auto-wait en acción', async ({ page }) => {
    // Setup: Login primero
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Click en un producto - Playwright espera a que el elemento sea clickeable
    await page.locator('[data-test="item-4-title-link"]').click();
    
    // Esperamos estar en la página del producto
    await expect(page).toHaveURL(/.*inventory-item.html/);
    
    // Volver atrás
    await page.locator('[data-test="back-to-products"]').click();
    
    // Verificar que volvimos
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('Cuándo SÍ necesitamos esperas explícitas', () => {

  test('waitForLoadState - esperar a que la página termine de cargar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Esperar a que no haya más actividad de red
    // Útil para páginas con muchos recursos (imágenes, scripts)
    await page.waitForLoadState('networkidle');
    
    // Ahora podemos estar seguros de que todo cargó
    await expect(page.locator('.login_logo')).toBeVisible();
  });

  test('waitForURL - esperar redirección', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Esperar explícitamente a que la URL cambie
    await page.waitForURL('**/inventory.html');
    
    // Ahora continuar con el test
    const titulo = page.locator('[data-test="title"]');
    await expect(titulo).toHaveText('Products');
  });

  test('waitForResponse - esperar respuesta de API', async ({ page }) => {
    // Este patrón es útil cuando necesitamos esperar datos del servidor
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // Ejemplo conceptual: si la app hiciera un request al hacer login
    // const responsePromise = page.waitForResponse('**/api/login');
    // await page.locator('[data-test="login-button"]').click();
    // const response = await responsePromise;
    // expect(response.status()).toBe(200);
    
    // SauceDemo no usa API, pero el patrón es importante conocerlo
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('ANTI-PATRÓN: Evitar sleeps fijos', () => {

  test('MAL: Usar page.waitForTimeout (sleep)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // ❌ ANTI-PATRÓN: Esperar un tiempo fijo
    // Esto es frágil: si la página es más lenta, falla
    // Si es más rápida, perdemos tiempo
    // await page.waitForTimeout(3000); // NO HACER ESTO
    
    // ✅ CORRECTO: Esperar por una condición real
    await expect(page.locator('.login_logo')).toBeVisible();
    
    // El test sigue siendo válido, solo queríamos mostrar el anti-patrón
    await page.locator('[data-test="username"]').fill('standard_user');
  });

  test('BIEN: Dejar que Playwright maneje las esperas', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // ✅ Playwright automáticamente:
    // 1. Espera a que el elemento exista en el DOM
    // 2. Espera a que sea visible
    // 3. Espera a que esté habilitado
    // 4. Espera a que esté estable (no animándose)
    // 5. Recién ahí ejecuta la acción
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Las aserciones también reintentan automáticamente
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

});
