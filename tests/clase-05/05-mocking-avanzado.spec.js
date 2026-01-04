// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 5: Mocking Avanzado - Casos de Uso Reales
 * ===============================================
 */

test.describe('Caso 1: Simular Estados de Error', () => {

  test('Simular error 500', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'El servidor no está disponible'
        })
      });
    });
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Simular error de autenticación (401)', async ({ page }) => {
    await page.route('**/api/protected/**', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Su sesión ha expirado'
        })
      });
    });
  });

});

test.describe('Caso 2: Simular Datos Específicos', () => {

  test('Carrito vacío', async ({ page }) => {
    await page.route('**/api/cart', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0 })
      });
    });
  });

  test('Carrito con muchos productos', async ({ page }) => {
    const manyItems = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Producto ${i + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: parseFloat((Math.random() * 100).toFixed(2))
    }));
    
    await page.route('**/api/cart', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: manyItems,
          total: manyItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        })
      });
    });
  });

});

test.describe('Caso 3: Simular Comportamientos de Red', () => {

  test('Conexión lenta', async ({ page }) => {
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Respuestas condicionales', async ({ page }) => {
    let requestCount = 0;
    
    await page.route('**/api/data', async (route) => {
      requestCount++;
      
      if (requestCount === 1) {
        await route.fulfill({ status: 200, body: '{"status": "ok"}' });
      } else if (requestCount === 2) {
        await route.fulfill({ status: 500 });
      } else {
        await route.fulfill({ status: 200, body: '{"status": "recovered"}' });
      }
    });
  });

});

test.describe('Caso 4: Feature Flags', () => {

  test('Simular feature flag activada', async ({ page }) => {
    await page.route('**/api/feature-flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          newCheckout: true,
          darkMode: true,
          betaFeatures: true
        })
      });
    });
  });

});
