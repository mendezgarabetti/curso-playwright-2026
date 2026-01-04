// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 2: Catálogo de Aserciones (Assertions)
 * ============================================
 * Las aserciones son el CORAZÓN de un test.
 * Sin aserciones, solo tenemos un script que navega.
 * 
 * Playwright tiene "auto-retrying assertions":
 * - Reintentan automáticamente hasta que pasen o se agote el timeout
 * - Por defecto esperan hasta 5 segundos
 * - Perfecto para páginas dinámicas
 */

test.describe('Aserciones de Visibilidad', () => {

  test.beforeEach(async ({ page }) => {
    // Setup común: ir a SauceDemo y hacer login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('toBeVisible - el elemento está visible en pantalla', async ({ page }) => {
    // Verificar que el título de productos sea visible
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    
    // Verificar que el carrito sea visible
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('toBeHidden - el elemento NO está visible', async ({ page }) => {
    // El mensaje de error NO debería estar visible después de login exitoso
    await expect(page.locator('[data-test="error"]')).toBeHidden();
  });

  test('toBeEnabled / toBeDisabled - estado de elementos interactivos', async ({ page }) => {
    // Los botones de agregar al carrito deberían estar habilitados
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeEnabled();
    
    // Nota: SauceDemo no tiene botones deshabilitados, pero la sintaxis sería:
    // await expect(page.locator('#boton-deshabilitado')).toBeDisabled();
  });

});

test.describe('Aserciones de Texto y Contenido', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('toHaveText - texto exacto', async ({ page }) => {
    // El título debe decir exactamente "Products"
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('toContainText - texto parcial', async ({ page }) => {
    // El primer producto contiene "Sauce Labs" en su nombre
    const primerProducto = page.locator('[data-test="inventory-item-name"]').first();
    await expect(primerProducto).toContainText('Sauce Labs');
  });

  test('toHaveValue - valor de un input', async ({ page }) => {
    // Ir al checkout para ver inputs con valores
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Llenar un campo y verificar su valor
    await page.locator('[data-test="firstName"]').fill('Juan');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Juan');
  });

  test('toBeEmpty - input vacío', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Los campos deberían estar vacíos inicialmente
    await expect(page.locator('[data-test="firstName"]')).toBeEmpty();
    await expect(page.locator('[data-test="lastName"]')).toBeEmpty();
  });

});

test.describe('Aserciones de Página', () => {

  test('toHaveURL - verificar URL', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // URL exacta
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // URL con regex
    await expect(page).toHaveURL(/saucedemo\.com/);
    
    // Login y verificar nueva URL
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('toHaveTitle - verificar título de la pestaña', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page).toHaveTitle(/Swag/);
  });

});

test.describe('Aserciones de Atributos y Clases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('toHaveAttribute - verificar atributo HTML', async ({ page }) => {
    // Verificar el atributo data-test
    await expect(page.locator('[data-test="title"]')).toHaveAttribute('data-test', 'title');
    
    // Verificar la clase del contenedor
    const inventario = page.locator('#inventory_container');
    await expect(inventario).toHaveAttribute('class', /inventory_container/);
  });

  test('toHaveClass - verificar clase CSS', async ({ page }) => {
    const inventario = page.locator('#inventory_container');
    await expect(inventario).toHaveClass(/inventory_container/);
  });

  test('toHaveCount - cantidad de elementos', async ({ page }) => {
    // Deberían haber exactamente 6 productos en SauceDemo
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(6);
  });

  test('toHaveCSS - verificar estilos CSS', async ({ page }) => {
    // Verificar el tamaño de fuente del título
    const titulo = page.locator('[data-test="title"]');
    // Nota: los colores se devuelven en formato rgb()
    await expect(titulo).toHaveCSS('font-size', '24px');
  });

});

test.describe('Aserciones con Negación', () => {

  test('not - negar cualquier aserción', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verificar que NO estamos en la página de login
    await expect(page).not.toHaveURL('https://www.saucedemo.com/');
    
    // Verificar que el error NO es visible
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
    
    // Verificar que el carrito NO tiene items (badge no existe)
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

});

test.describe('Aserciones con Timeout Personalizado', () => {

  test('Cambiar timeout para una aserción específica', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Esperar hasta 10 segundos (en lugar de los 5 por defecto)
    await expect(page.locator('[data-test="title"]')).toBeVisible({ timeout: 10000 });
    
    // Útil para elementos que tardan en aparecer
    // (páginas con carga lenta, animaciones, etc.)
  });

});
