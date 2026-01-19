// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 5: Intercepción de Red (Network Mocking)
 * ==============================================
 */

test.describe('Intercepción Básica: page.route()', () => {

  test('Interceptar y observar requests', async ({ page }) => {
    const interceptedUrls = [];
    
    await page.route('**/*', async (route) => {
      interceptedUrls.push(route.request().url());
      await route.continue();
    });
    
    await page.goto('https://www.saucedemo.com/');
    
    expect(interceptedUrls.length).toBeGreaterThan(0);
    expect(interceptedUrls.some(url => url.includes('saucedemo.com'))).toBe(true);
  });

  test('Bloquear recursos para acelerar tests', async ({ page }) => {
    // Bloquear imágenes
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
    
    // Bloquear fuentes
    await page.route('**/*.{woff,woff2,ttf}', route => route.abort());
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('Mocking de Responses', () => {

  test('Simular respuesta de API', async ({ page }) => {
    await page.route('**/api/inventory', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Producto Mock 1', price: 9.99 },
          { id: 2, name: 'Producto Mock 2', price: 19.99 }
        ])
      });
    });
    
    // Demo conceptual - SauceDemo no usa esta API
    await page.goto('https://www.saucedemo.com/');
  });

  test('Simular error 500', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error'
        })
      });
    });
  });

  test('Simular error 404', async ({ page }) => {
    await page.route('**/api/product/*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Not Found'
        })
      });
    });
  });

});

test.describe('Modificar Responses', () => {

  test('Interceptar y modificar response', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users/1', async (route) => {
      const response = await route.fetch({
        headers: { 'accept-encoding': 'identity' }
      });

      const json = await response.json();

      json.name = 'Usuario Modificado';
      json.email = 'modificado@test.com';

      await route.fulfill({ json });

    });

    // Probar con evaluate
    const result = await page.evaluate(async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
      return res.json();
    });

    // El mock solo aplica si navegamos a una página que lo use
  });

});
