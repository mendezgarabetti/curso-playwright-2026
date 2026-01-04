// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 3: Buenas Prácticas de Depuración
 * =======================================
 */

test.describe('✅ BUENA PRÁCTICA: Logs Estructurados', () => {

  test('Usar prefijos para identificar logs', async ({ page }) => {
    console.log('🚀 [TEST START] Login y compra');
    
    await page.goto('https://www.saucedemo.com/');
    console.log('📍 [NAV] Página de login cargada');
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    console.log('🔐 [AUTH] Login completado');
    
    await expect(page).toHaveURL(/.*inventory.html/);
    console.log('✅ [ASSERT] URL correcta');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    console.log('🛒 [ACTION] Producto agregado');
    
    const badge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    console.log(`📊 [DATA] Items en carrito: ${badge}`);
    
    console.log('🏁 [TEST END] Completado exitosamente');
  });

});

test.describe('✅ BUENA PRÁCTICA: Screenshots en Puntos Clave', () => {

  test('Capturar estado visual en momentos importantes', async ({ page }) => {
    const testName = 'checkout-flow';
    let step = 0;
    
    const screenshot = async (description) => {
      step++;
      await page.screenshot({
        path: `test-results/debug/${testName}-${String(step).padStart(2, '0')}-${description}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot: ${description}`);
    };
    
    await page.goto('https://www.saucedemo.com/');
    await screenshot('login-page');
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    await screenshot('inventory-page');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await screenshot('product-added');
  });

});

test.describe('✅ BUENA PRÁCTICA: Verificaciones Incrementales', () => {

  test('Verificar cada paso antes de continuar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await expect(page.locator('[data-test="username"]')).toHaveValue('standard_user');
    
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await expect(page.locator('[data-test="password"]')).toHaveValue('secret_sauce');
    
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

});

test.describe('❌ ANTI-PATRÓN: Evitar Sleeps', () => {

  test('Mal: Sleep arbitrario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // ❌ MAL: Esperar tiempo fijo
    // await page.waitForTimeout(3000);
    
    // ✅ BIEN: Esperar condición específica
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('❌ ANTI-PATRÓN: Evitar Índices Hardcodeados', () => {

  test('Mal: Usar índices sin contexto', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // ❌ MAL: ¿Qué producto es el índice 2?
    // await page.locator('.inventory_item').nth(2).click();
    
    // ✅ BIEN: Selector descriptivo
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

});
