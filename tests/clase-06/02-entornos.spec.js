// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 6: Tests Multi-Entorno
 * ============================
 * Ejecutar tests contra diferentes entornos:
 * - Development
 * - Staging
 * - Production
 * 
 * Uso:
 * TEST_ENV=staging npx playwright test
 */

const ENVIRONMENTS = {
  dev: 'https://dev.saucedemo.com',
  staging: 'https://staging.saucedemo.com',
  prod: 'https://www.saucedemo.com',
  local: 'http://localhost:3000'
};

// Obtener entorno de variable de entorno
const ENV = process.env.TEST_ENV || 'prod';
const BASE_URL = ENVIRONMENTS[ENV] || ENVIRONMENTS.prod;

test.describe(`Tests en entorno: ${ENV}`, () => {

  test.beforeAll(() => {
    console.log(`🌍 Entorno: ${ENV}`);
    console.log(`🔗 URL: ${BASE_URL}`);
  });

  test('Login funciona en el entorno actual', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Productos se muestran correctamente', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

});

test.describe('Configuración por Entorno', () => {

  test('Verificar configuración actual', async ({ page }) => {
    console.log('Variables de entorno disponibles:');
    console.log('- TEST_ENV:', process.env.TEST_ENV || '(no definido, usando prod)');
    console.log('- CI:', process.env.CI || '(no definido)');
    console.log('- BASE_URL usado:', BASE_URL);
  });

});
