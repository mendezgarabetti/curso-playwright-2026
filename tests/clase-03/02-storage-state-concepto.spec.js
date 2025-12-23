// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * CLASE 3: Reutilización de Sesiones (Storage State)
 * ==================================================
 * Problema: Si tenemos 50 tests y cada uno hace login,
 * perdemos MUCHO tiempo repitiendo el mismo proceso.
 * 
 * Solución: Guardar el estado de autenticación (cookies, localStorage)
 * y reutilizarlo en los demás tests.
 * 
 * Beneficios:
 * - Tests más rápidos (no repiten login)
 * - Menos carga al servidor
 * - Tests más estables (menos puntos de fallo)
 */

// Ruta donde guardaremos el estado de autenticación
const AUTH_FILE = path.join(__dirname, '../../.auth/saucedemo.json');

test.describe('El Problema: Login Repetido', () => {

  // Imagina que estos son 3 tests de una suite de 50
  // Cada uno pierde ~3 segundos en el login

  test('Test 1: Agregar producto (con login)', async ({ page }) => {
    // LOGIN (3 segundos)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // TEST REAL (lo que realmente queremos probar)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Test 2: Ordenar productos (con login)', async ({ page }) => {
    // LOGIN REPETIDO (otros 3 segundos)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // TEST REAL
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');
  });

  test('Test 3: Ver detalle de producto (con login)', async ({ page }) => {
    // LOGIN REPETIDO (otros 3 segundos más)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // TEST REAL
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item.html/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toBeVisible();
  });

  // Con 50 tests: 50 × 3 segundos = 2.5 minutos SOLO en logins
  // Con storage state: 3 segundos (1 login) + 50 tests sin login

});

test.describe('La Solución: Storage State', () => {

  /**
   * PASO 1: Crear un "setup project" que hace login y guarda el estado
   * 
   * En playwright.config.js:
   * 
   * projects: [
   *   {
   *     name: 'setup',
   *     testMatch: /global.setup\.js/,
   *   },
   *   {
   *     name: 'chromium',
   *     use: { 
   *       storageState: '.auth/saucedemo.json',
   *     },
   *     dependencies: ['setup'], // Espera a que setup termine
   *   },
   * ]
   */

  test('Simular guardado de estado (demo conceptual)', async ({ page, context }) => {
    // 1. Hacer login normalmente
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // 2. Guardar el estado (cookies, localStorage, sessionStorage)
    // Esto normalmente se hace en un archivo de setup global
    // await context.storageState({ path: AUTH_FILE });
    
    // NOTA: SauceDemo no usa cookies/tokens reales,
    // pero en una app real esto funcionaría perfectamente
    
    console.log('Estado guardado en:', AUTH_FILE);
  });

});

/**
 * EJEMPLO DE ESTRUCTURA RECOMENDADA:
 * 
 * tests/
 *   auth.setup.js        <- Hace login y guarda estado
 *   productos.spec.js    <- Usa estado guardado
 *   carrito.spec.js      <- Usa estado guardado
 *   checkout.spec.js     <- Usa estado guardado
 * 
 * .auth/
 *   user.json            <- Estado guardado (gitignore!)
 */
