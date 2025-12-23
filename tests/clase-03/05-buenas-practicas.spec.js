// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 3: Buenas Prácticas de Depuración
 * =======================================
 * Una guía de patrones y anti-patrones para debugging efectivo.
 */

test.describe('✅ BUENA PRÁCTICA: Logs Estructurados', () => {

  test('Usar prefijos para identificar logs fácilmente', async ({ page }) => {
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
    await screenshot('inventory-loaded');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await screenshot('product-added');
    
    await page.locator('.shopping_cart_link').click();
    await screenshot('cart-view');
  });

});

test.describe('✅ BUENA PRÁCTICA: Verificaciones Incrementales', () => {

  test('Verificar cada paso antes de continuar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Verificar que la página cargó
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    
    // Llenar y verificar cada campo
    await page.locator('[data-test="username"]').fill('standard_user');
    await expect(page.locator('[data-test="username"]')).toHaveValue('standard_user');
    
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await expect(page.locator('[data-test="password"]')).toHaveValue('secret_sauce');
    
    // Click y verificar resultado
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Si algo falla, sabemos EXACTAMENTE dónde
  });

});

test.describe('❌ ANTI-PATRÓN: Tests Frágiles', () => {

  test.skip('Evitar: Hardcodear índices de arrays', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // ❌ MAL: Depende del orden de los elementos
    // Si cambia el orden, el test falla
    await page.locator('.inventory_item').nth(3).click();
    
    // ✅ MEJOR: Usar selector específico por nombre
    // await page.locator('[data-test="item-4-title-link"]').click();
  });

  test.skip('Evitar: Sleeps arbitrarios', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // ❌ MAL: Esperar tiempo fijo
    // await page.waitForTimeout(5000);
    
    // ✅ MEJOR: Esperar condición específica
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('✅ BUENA PRÁCTICA: Mensajes de Error Descriptivos', () => {

  test('Agregar contexto a las aserciones', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Las aserciones pueden tener un mensaje personalizado
    // que aparece si fallan
    const productos = page.locator('[data-test="inventory-item"]');
    const count = await productos.count();
    
    // Mensaje personalizado en caso de fallo
    expect(count, `Esperaba 6 productos pero encontré ${count}`).toBe(6);
  });

});

test.describe('✅ BUENA PRÁCTICA: Aislamiento de Tests', () => {

  // Cada test debe ser independiente
  // No depender del estado de tests anteriores
  
  test('Test A: agregar producto', async ({ page }) => {
    // Setup completo dentro del test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Test B: verificar ordenamiento', async ({ page }) => {
    // Setup completo dentro del test (independiente de Test A)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');
  });

});

test.describe('✅ BUENA PRÁCTICA: Helper Functions', () => {

  // Extraer lógica repetida a funciones helper
  
  async function login(page, username = 'standard_user', password = 'secret_sauce') {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  }

  async function addToCart(page, productDataTest) {
    await page.locator(`[data-test="add-to-cart-${productDataTest}"]`).click();
  }

  test('Usar helpers para código limpio', async ({ page }) => {
    await login(page);
    
    await addToCart(page, 'sauce-labs-backpack');
    await addToCart(page, 'sauce-labs-bike-light');
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });

  test('Helpers con parámetros personalizados', async ({ page }) => {
    // Probar con usuario problemático
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('problem_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Este usuario tiene bugs conocidos en SauceDemo
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});
