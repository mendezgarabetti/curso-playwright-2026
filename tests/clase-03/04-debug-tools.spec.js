// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 3: Herramientas de Depuración
 * ===================================
 * Cuando un test falla, necesitamos herramientas para investigar.
 * Playwright ofrece varias opciones:
 * 
 * 1. page.pause() - Pausa interactiva
 * 2. --debug flag - Inspector de Playwright
 * 3. --ui flag - Modo UI con timeline
 * 4. console.log() - Logs tradicionales
 * 5. Screenshots manuales
 * 6. Trace Viewer (visto antes)
 */

test.describe('page.pause(): Pausa Interactiva', () => {

  test('Usar pause para inspeccionar el estado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // DESCOMENTAR para usar pause:
    // await page.pause();
    // 
    // Cuando se ejecuta con pause:
    // 1. Se abre el Playwright Inspector
    // 2. El test se DETIENE aquí
    // 3. Podés inspeccionar el DOM
    // 4. Podés ejecutar comandos en la consola
    // 5. Podés continuar paso a paso
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Pause en medio de un flujo complejo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    
    // DESCOMENTAR para inspeccionar el carrito:
    // await page.pause();
    
    await page.locator('[data-test="checkout"]').click();
    
    // DESCOMENTAR para inspeccionar el formulario vacío:
    // await page.pause();
    
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  });

});

test.describe('Console.log para Debug', () => {

  test('Imprimir información útil durante el test', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Log de inicio
    console.log('📍 Iniciando test de login...');
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Log de URL actual
    const currentURL = page.url();
    console.log('📍 URL después de login:', currentURL);
    
    // Log de elementos encontrados
    const productos = await page.locator('[data-test="inventory-item"]').count();
    console.log('📍 Cantidad de productos encontrados:', productos);
    
    // Log de texto de un elemento
    const titulo = await page.locator('[data-test="title"]').textContent();
    console.log('📍 Título de la página:', titulo);
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Debug de valores dinámicos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Obtener todos los precios
    const precios = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    console.log('📍 Precios encontrados:', precios);
    
    // Obtener todos los nombres
    const nombres = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    console.log('📍 Nombres de productos:', nombres);
    
    // Verificar algo específico
    const tieneMochila = nombres.some(n => n.includes('Backpack'));
    console.log('📍 ¿Tiene Backpack?:', tieneMochila);
    
    expect(tieneMochila).toBe(true);
  });

});

test.describe('Screenshots Manuales', () => {

  test('Tomar screenshots en puntos clave', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Screenshot de la página de login
    await page.screenshot({ 
      path: 'test-results/debug/01-login-page.png',
      fullPage: true 
    });
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Screenshot del inventario
    await page.screenshot({ 
      path: 'test-results/debug/02-inventory.png',
      fullPage: true 
    });
    
    // Agregar productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Screenshot solo del carrito (elemento específico)
    await page.locator('.shopping_cart_link').screenshot({
      path: 'test-results/debug/03-cart-badge.png'
    });
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });

  test('Screenshot de elemento específico', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Screenshot solo del primer producto
    const primerProducto = page.locator('[data-test="inventory-item"]').first();
    await primerProducto.screenshot({
      path: 'test-results/debug/04-primer-producto.png'
    });
    
    // Screenshot del header
    await page.locator('.header_container').screenshot({
      path: 'test-results/debug/05-header.png'
    });
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

});

test.describe('Ejecutar con --debug', () => {

  /**
   * El flag --debug abre el Playwright Inspector automáticamente:
   * 
   * npx playwright test 04-debug-tools.spec.js --debug
   * 
   * El Inspector permite:
   * - Ver el código del test resaltado
   * - Ejecutar paso a paso (Step Over)
   * - Ver el selector que se está buscando
   * - Probar selectores en vivo
   * - Ver el DOM actual
   */

  test('Test para ejecutar con --debug', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // En modo debug, cada línea se pausa
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

test.describe('Modo UI (--ui)', () => {

  /**
   * El modo UI es la forma más visual de depurar:
   * 
   * npx playwright test --ui
   * 
   * Características:
   * - Timeline visual de cada test
   * - Watch mode (re-ejecuta al guardar cambios)
   * - Filtrar tests por nombre/archivo
   * - Ver traces integrados
   * - Screenshots en cada paso
   */

  test('Test para explorar en modo UI', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // El modo UI mostrará cada paso con su screenshot
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
  });

});
