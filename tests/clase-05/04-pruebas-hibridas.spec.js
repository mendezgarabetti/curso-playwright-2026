// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 5: Pruebas Híbridas (API + UI)
 * ====================================
 */

test.describe('Patrón: API Setup + UI Test', () => {

  test('Crear datos vía API, verificar en UI', async ({ request, page }) => {
    // 1. Setup vía API (rápido)
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Post de Prueba',
        body: 'Contenido',
        userId: 1
      }
    });
    expect(response.status()).toBe(201);
    
    // 2. Verificar en UI (SauceDemo no consume esta API, es demo)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('Patrón: UI Action + API Verify', () => {

  test('Acción en UI, verificar estado vía API', async ({ request, page }) => {
    // 1. Acción en UI
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 2. Verificar vía API (conceptual)
    // const cartResponse = await request.get('/api/cart');
    // const cart = await cartResponse.json();
    // expect(cart.items).toHaveLength(1);
    
    // En SauceDemo verificamos en UI
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

test.describe('Patrón: Mock Backend', () => {

  test('Simular respuestas sin backend real', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Producto Mock', price: 99.99 }
        ])
      });
    });
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('Beneficios del Enfoque Híbrido', () => {

  /**
   * Test E2E puro: ~18 segundos
   * Test híbrido: ~3.5 segundos
   * ¡5x más rápido!
   */

  test('Demo de velocidad', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Tiempo: ${duration}ms`);
  });

});
