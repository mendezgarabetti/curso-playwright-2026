// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 6: Ejecución Paralela y Optimización
 * ==========================================
 * Playwright ejecuta tests en paralelo por defecto.
 * 
 * Configuración en playwright.config.js:
 *   fullyParallel: true      // Paraleliza todos los tests
 *   workers: 4               // Número de workers (auto por defecto)
 *   retries: 2               // Reintentos en caso de fallo
 */

// ═══════════════════════════════════════════════════════════════════════════
// TESTS PARALELOS (por defecto)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Suite Paralela A', () => {
  // Estos tests corren en paralelo con Suite B

  test('Test A1', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    console.log(`Test A1 completado en ${Date.now() - start}ms`);
  });

  test('Test A2', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    console.log(`Test A2 completado en ${Date.now() - start}ms`);
  });

  test('Test A3', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
    await expect(firstPrice).toHaveText('$7.99');
    console.log(`Test A3 completado en ${Date.now() - start}ms`);
  });
});

test.describe('Suite Paralela B', () => {
  // Estos tests corren en paralelo con Suite A

  test('Test B1', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    console.log(`Test B1 completado en ${Date.now() - start}ms`);
  });

  test('Test B2', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item.html/);
    console.log(`Test B2 completado en ${Date.now() - start}ms`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTS SECUENCIALES (cuando se necesita orden)
// ═══════════════════════════════════════════════════════════════════════════

test.describe.serial('Suite Secuencial', () => {
  // Estos tests corren UNO DESPUÉS DEL OTRO en orden

  test('Paso 1: Login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Paso 2: Agregar producto (depende de Paso 1)', async ({ page }) => {
    // Nota: En serial, cada test tiene su propio contexto
    // Hay que repetir el setup o usar storage state
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Paso 3: Checkout (depende de Paso 2)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZACIÓN: Bloquear recursos innecesarios
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Tests Optimizados', () => {

  test('Test rápido (sin imágenes)', async ({ page }) => {
    const start = Date.now();
    
    // Bloquear recursos pesados
    await page.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2}', route => route.abort());
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    console.log(`⚡ Test optimizado completado en ${Date.now() - start}ms`);
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// REINTENTOS (Retries)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Tests con Reintentos', () => {

  // Configurar reintentos para este describe
  test.describe.configure({ retries: 2 });

  test('Test que puede ser flaky', async ({ page }) => {
    // Si falla, se reintentará hasta 2 veces
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Detectar si es reintento', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
      console.log(`🔄 Reintento número: ${testInfo.retry}`);
    }
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// COMANDOS DE EJECUCIÓN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * COMANDOS PARA CONTROLAR PARALELISMO:
 * 
 * Ejecutar con número específico de workers:
 *   npx playwright test --workers=4
 *   npx playwright test --workers=1  (secuencial)
 * 
 * Ejecutar un solo archivo:
 *   npx playwright test archivo.spec.js
 * 
 * Ejecutar tests que coincidan con un patrón:
 *   npx playwright test --grep "login"
 *   npx playwright test --grep-invert "slow"
 * 
 * Ejecutar con reintentos:
 *   npx playwright test --retries=3
 * 
 * Ver tiempo de cada test:
 *   npx playwright test --reporter=list
 */
