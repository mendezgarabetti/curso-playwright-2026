// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO 2: Network Mocking                                         ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Practicar intercepción de requests y mocking de responses            ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('Ejercicio 1: Intercepción Básica', () => {

  test('1.1 Contar requests de imágenes', async ({ page }) => {
    const imageUrls = [];
    
    // TODO: Interceptar imágenes (png, jpg, jpeg)
    // await page.route('**/*.{png,jpg,jpeg}', async (route) => {
    //   imageUrls.push(route.request().url());
    //   await route.continue();
    // });
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.waitForLoadState('networkidle');
    
    console.log('Imágenes cargadas:', imageUrls.length);
    // expect(imageUrls.length).toBeGreaterThan(5);
  });

  test('1.2 Bloquear imágenes para acelerar test', async ({ page }) => {
    const startTime = Date.now();
    
    // TODO: Bloquear imágenes
    // await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    const duration = Date.now() - startTime;
    console.log(`Tiempo: ${duration}ms`);
  });

});

test.describe('Ejercicio 2: Mocking de Responses', () => {

  test('2.1 Simular respuesta de API', async ({ page }) => {
    const mockProducts = [
      { id: 1, name: 'Producto Test 1', price: 19.99 },
      { id: 2, name: 'Producto Test 2', price: 29.99 }
    ];
    
    // TODO: Interceptar y devolver mockProducts
    // await page.route('**/api/products', async (route) => {
    //   await route.fulfill({
    //     status: 200,
    //     contentType: 'application/json',
    //     body: JSON.stringify(mockProducts)
    //   });
    // });
  });

  test('2.2 Simular error 500', async ({ page }) => {
    // TODO: Interceptar /api/** y devolver error 500
  });

});

test.describe('Ejercicio 3: Modificar Responses', () => {

  test('3.1 Modificar respuesta de JSONPlaceholder', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users/1', async (route) => {
      // TODO: Obtener respuesta real con route.fetch()
      // TODO: Modificar nombre a "Usuario Modificado"
      // TODO: Devolver respuesta modificada
    });
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * ✅ Intercepción básica funcionando
 * ✅ Mocks devolviendo datos personalizados
 * ✅ Modificación de responses
 * ✅ Bloqueo selectivo de recursos
 */
