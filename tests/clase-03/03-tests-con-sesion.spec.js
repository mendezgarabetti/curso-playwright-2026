// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 3: Tests que Reutilizan la Sesión
 * =======================================
 * Estos tests asumen que ya hay una sesión activa.
 * NO hacen login porque usan el storageState configurado.
 * 
 * NOTA: Para que funcionen, necesitan la configuración correcta
 * en playwright.config.js (ver auth.setup.js para detalles).
 * 
 * Para esta demo, incluimos el login en beforeEach como fallback,
 * pero en producción se quitaría.
 */

test.describe('Tests con Sesión Reutilizada (Ejemplo)', () => {

  // En producción, este beforeEach NO EXISTIRÍA
  // porque el storageState ya tiene la sesión
  test.beforeEach(async ({ page }) => {
    // Fallback: hacer login si no hay storageState configurado
    await page.goto('https://www.saucedemo.com/');
    
    // Verificar si ya estamos logueados
    const url = page.url();
    if (url.includes('inventory.html')) {
      // Ya estamos logueados (storageState funcionó)
      console.log('✅ Sesión reutilizada correctamente');
      return;
    }
    
    // Si no, hacer login (fallback para demo)
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Agregar producto al carrito', async ({ page }) => {
    // Ir directo al inventario (ya estamos logueados)
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Ordenar productos por precio', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');
  });

  test('Ver detalle de producto', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    await page.locator('[data-test="item-4-title-link"]').click();
    
    await expect(page).toHaveURL(/.*inventory-item.html/);
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('Verificar cantidad de productos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(6);
  });

  test('Abrir menú hamburguesa', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu-wrap')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
  });

});

/**
 * MÉTRICAS DE EJEMPLO:
 * 
 * Sin storageState (5 tests × 3 seg login):
 *   - Tiempo de login: 15 segundos
 *   - Tiempo de tests: 10 segundos
 *   - TOTAL: 25 segundos
 * 
 * Con storageState (1 setup + 5 tests sin login):
 *   - Tiempo de setup: 3 segundos (una vez)
 *   - Tiempo de tests: 10 segundos
 *   - TOTAL: 13 segundos
 * 
 * AHORRO: 48% más rápido
 * 
 * Con 50 tests: ahorro de ~2 minutos
 * Con 500 tests: ahorro de ~20 minutos
 */
