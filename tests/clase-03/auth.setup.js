// @ts-check
import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * 
 * 3. Cada "project" puede tener su propio storageState
 *    Útil para probar con diferentes usuarios/roles
 */
