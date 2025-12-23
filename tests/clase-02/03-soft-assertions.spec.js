// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 2: Soft Assertions
 * ========================
 * Por defecto, cuando una aserción falla, el test se DETIENE inmediatamente.
 * 
 * Con "Soft Assertions" (expect.soft), el test CONTINÚA ejecutándose
 * aunque la aserción falle. Al final, si hubo fallos, el test se marca como fallido.
 * 
 * ¿Cuándo usar Soft Assertions?
 * - Cuando queremos verificar MÚLTIPLES condiciones y ver TODAS las que fallan
 * - En tests de validación de formularios
 * - Cuando el fallo de una aserción no impide continuar el flujo
 */

test.describe('Soft Assertions en Acción', () => {

  test('Verificar múltiples productos con expect normal (se detiene en el primer fallo)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    const productos = page.locator('[data-test="inventory-item-name"]');
    
    // Si la primera aserción falla, las demás NO se ejecutan
    await expect(productos.nth(0)).toContainText('Sauce Labs');
    await expect(productos.nth(1)).toContainText('Sauce Labs');
    await expect(productos.nth(2)).toContainText('Sauce Labs');
    // Si nth(2) fallara, nunca veríamos si nth(3), nth(4), nth(5) también fallan
  });

  test('Verificar múltiples productos con expect.soft (ejecuta todas)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    const productos = page.locator('[data-test="inventory-item-name"]');
    
    // Con soft assertions, TODAS se ejecutan aunque alguna falle
    await expect.soft(productos.nth(0)).toContainText('Sauce Labs');
    await expect.soft(productos.nth(1)).toContainText('Sauce Labs');
    await expect.soft(productos.nth(2)).toContainText('Sauce Labs');
    await expect.soft(productos.nth(3)).toContainText('Sauce Labs');
    await expect.soft(productos.nth(4)).toContainText('Sauce Labs');
    await expect.soft(productos.nth(5)).toContainText('Sauce Labs');
    
    // Al final del test, Playwright reporta TODAS las que fallaron
  });

});

test.describe('Caso de Uso: Validación de Formulario', () => {

  test('Verificar todos los campos de checkout (soft assertions)', async ({ page }) => {
    // Setup: Login y agregar producto
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Intentar continuar sin llenar datos
    await page.locator('[data-test="continue"]').click();

    // Verificar que aparece el error
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();

    // Ahora llenar los campos y verificar cada uno con soft assertions
    await page.locator('[data-test="firstName"]').fill('Juan');
    await page.locator('[data-test="lastName"]').fill('Pérez');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Verificar que todos los campos tienen el valor correcto
    // Si alguno falla, veremos TODOS los que fallan, no solo el primero
    await expect.soft(page.locator('[data-test="firstName"]')).toHaveValue('Juan');
    await expect.soft(page.locator('[data-test="lastName"]')).toHaveValue('Pérez');
    await expect.soft(page.locator('[data-test="postalCode"]')).toHaveValue('12345');
  });

});

test.describe('Caso de Uso: Verificación de Página', () => {

  test('Verificar todos los elementos de la página de inventario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Verificaciones de estructura de la página
    // Queremos ver TODAS las que fallan para tener un reporte completo
    
    // Header
    await expect.soft(page.locator('.app_logo')).toBeVisible();
    await expect.soft(page.locator('.app_logo')).toHaveText('Swag Labs');
    await expect.soft(page.locator('.shopping_cart_link')).toBeVisible();
    await expect.soft(page.locator('#react-burger-menu-btn')).toBeVisible();

    // Contenido principal
    await expect.soft(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect.soft(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    await expect.soft(page.locator('[data-test="product-sort-container"]')).toBeVisible();

    // Footer
    await expect.soft(page.locator('.footer')).toBeVisible();
    await expect.soft(page.locator('.social')).toBeVisible();
  });

});

test.describe('Combinando Soft y Hard Assertions', () => {

  test('Usar soft para verificaciones secundarias, hard para críticas', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // HARD assertion: Si esto falla, no tiene sentido continuar
    // El test debe estar en la página correcta para que lo demás tenga sentido
    await expect(page).toHaveURL(/.*inventory.html/);

    // SOFT assertions: Verificaciones secundarias
    // Queremos ver el estado completo aunque algo falle
    await expect.soft(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect.soft(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    
    // Agregar al carrito
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // HARD assertion: Verificación crítica del flujo
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // SOFT assertions: Detalles adicionales
    await expect.soft(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

});

test.describe('IMPORTANTE: Limitaciones de Soft Assertions', () => {

  test('Los errores se reportan al FINAL del test', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Esto fallará (el título dice "Products", no "Inventario")
    await expect.soft(page.locator('[data-test="title"]')).toHaveText('Inventario');
    
    // El test CONTINÚA ejecutándose
    console.log('Este console.log SÍ se ejecuta');
    
    // Más verificaciones
    await expect.soft(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    
    // Al terminar el test, Playwright marca como FALLIDO
    // y muestra todas las soft assertions que fallaron
  });

});
