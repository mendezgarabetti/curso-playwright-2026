// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 6: Reportes y Attachments
 * ===============================
 * Playwright genera reportes HTML, JSON, JUnit.
 */

test.describe('Reportes Enriquecidos', () => {

  test('Test con screenshots adjuntos', async ({ page }) => {
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
    
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('Test con datos adjuntos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Adjuntar datos al reporte
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

test.describe('Anotaciones de Test', () => {

  test('Test con anotaciones', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/example/issues/123'
    });
    
    test.info().annotations.push({
      type: 'owner',
      description: 'equipo-qa'
    });
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('.login_logo')).toBeVisible();
  });

});
