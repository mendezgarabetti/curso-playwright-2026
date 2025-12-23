// @ts-check
const { test as setup, expect } = require('@playwright/test');
const path = require('path');

/**
 * CLASE 3: Global Setup para Autenticación
 * =========================================
 * Este archivo se ejecuta UNA SOLA VEZ antes de todos los tests.
 * Hace login y guarda el estado de la sesión.
 * 
 * Para usar este archivo, configurar en playwright.config.js:
 * 
 * projects: [
 *   {
 *     name: 'setup',
 *     testMatch: /auth\.setup\.js/,
 *   },
 *   {
 *     name: 'chromium',
 *     use: { 
 *       ...devices['Desktop Chrome'],
 *       storageState: '.auth/user.json',
 *     },
 *     dependencies: ['setup'],
 *   },
 * ]
 */

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('Autenticación global', async ({ page }) => {
  // 1. Ir a la página de login
  await page.goto('https://www.saucedemo.com/');
  
  // 2. Hacer login
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  
  // 3. Esperar a que el login sea exitoso
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  
  // 4. Guardar el estado de la sesión
  // Esto incluye: cookies, localStorage, sessionStorage
  await page.context().storageState({ path: authFile });
  
  console.log('✅ Estado de autenticación guardado en:', authFile);
});

/**
 * IMPORTANTE:
 * 
 * 1. El archivo .auth/user.json contiene datos sensibles
 *    AGREGAR A .gitignore: .auth/
 * 
 * 2. El estado tiene fecha de expiración (según la app)
 *    Si los tokens expiran, el setup se vuelve a ejecutar
 * 
 * 3. Cada "project" puede tener su propio storageState
 *    Útil para probar con diferentes usuarios/roles
 * 
 * EJEMPLO CON MÚLTIPLES USUARIOS:
 * 
 * projects: [
 *   { name: 'setup-admin', testMatch: /admin\.setup\.js/ },
 *   { name: 'setup-user', testMatch: /user\.setup\.js/ },
 *   { 
 *     name: 'admin-tests',
 *     use: { storageState: '.auth/admin.json' },
 *     dependencies: ['setup-admin'],
 *   },
 *   { 
 *     name: 'user-tests',
 *     use: { storageState: '.auth/user.json' },
 *     dependencies: ['setup-user'],
 *   },
 * ]
 */
