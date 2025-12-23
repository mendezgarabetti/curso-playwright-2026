// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  TALLER DE DEPURACIÓN: Tests Rotos para Arreglar                      ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Estos tests tienen ERRORES INTENCIONALES.                            ║
 * ║  Tu misión: encontrar y arreglar cada error.                          ║
 * ║                                                                       ║
 * ║  Herramientas sugeridas:                                              ║
 * ║  - npx playwright test --debug                                        ║
 * ║  - npx playwright test --ui                                           ║
 * ║  - page.pause()                                                       ║
 * ║  - console.log()                                                      ║
 * ║  - Trace Viewer                                                       ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('🔴 BUG 1: Selector Incorrecto', () => {

  test('Login con selector equivocado - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // 🐛 BUG: El selector está mal escrito
    // PISTA: Revisá el atributo data-test del input de usuario
    await page.locator('[data-test="user-name"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('🔴 BUG 2: Aserción Incorrecta', () => {

  test('Verificar cantidad de productos - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: La cantidad esperada es incorrecta
    // PISTA: ¿Cuántos productos hay realmente en SauceDemo?
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(5);
  });

});

test.describe('🔴 BUG 3: Falta await', () => {

  test('Agregar al carrito sin await - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: Falta el await en una línea
    // PISTA: El test puede pasar a veces y fallar otras (flaky)
    page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

test.describe('🔴 BUG 4: Orden de Operaciones', () => {

  test('Checkout sin agregar producto - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: El orden de las acciones está mal
    // PISTA: ¿Qué debería pasar ANTES de ir al checkout?
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    // El checkout debería tener al menos un producto
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Esta aserción fallará porque el carrito está vacío
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  });

});

test.describe('🔴 BUG 5: Texto Exacto vs Parcial', () => {

  test('Verificar mensaje de error - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Login con usuario bloqueado
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: El mensaje esperado no coincide exactamente
    // PISTA: ¿Deberías usar toHaveText() o toContainText()?
    const error = page.locator('[data-test="error"]');
    await expect(error).toHaveText('this user has been locked out');
  });

});

test.describe('🔴 BUG 6: Timeout Muy Corto', () => {

  test('Espera insuficiente - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: El timeout es demasiado corto
    // PISTA: En redes lentas, 100ms no es suficiente
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 100 });
  });

});

test.describe('🔴 BUG 7: Elemento Equivocado', () => {

  test('Click en elemento incorrecto - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 🐛 BUG: Click en el elemento equivocado para ir al carrito
    // PISTA: ¿Cuál es el selector correcto del ícono del carrito?
    await page.locator('[data-test="shopping-cart-badge"]').click();
    
    await expect(page).toHaveURL(/.*cart.html/);
  });

});

test.describe('🔴 BUG 8: Condición de Carrera', () => {

  test('Verificar antes de que cargue - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: Verificamos el precio ANTES de ordenar
    // PISTA: El orden de las acciones importa
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');
    
    // Ordenar por precio bajo a alto
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  });

});

test.describe('🔴 BUG 9: URL Hardcodeada Incorrecta', () => {

  test('Navegación con URL mal escrita - ARREGLAR', async ({ page }) => {
    // 🐛 BUG: La URL está mal escrita
    // PISTA: Revisá el dominio
    await page.goto('https://www.sausedemo.com/');
    
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('🔴 BUG 10: Lógica del Test Incorrecta', () => {

  test('Verificar producto removido - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Remover producto
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // 🐛 BUG: La verificación es incorrecta después de remover
    // PISTA: Si el carrito está vacío, ¿el badge existe?
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('0');
  });

});
