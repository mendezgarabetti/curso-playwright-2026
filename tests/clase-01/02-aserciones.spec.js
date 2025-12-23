// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 1: Aserciones Básicas
 * ===========================
 * Las aserciones son la forma de VERIFICAR que la aplicación
 * se comporta como esperamos.
 * 
 * En Playwright usamos expect() con matchers específicos para web.
 * 
 * TIPOS DE ASERCIONES:
 * 
 * 📄 Página
 *    - toHaveURL()
 *    - toHaveTitle()
 * 
 * 🔲 Elementos
 *    - toBeVisible()
 *    - toBeEnabled() / toBeDisabled()
 *    - toHaveText()
 *    - toContainText()
 *    - toHaveValue()
 *    - toHaveAttribute()
 *    - toHaveCount()
 * 
 * 🔢 Genéricas
 *    - toBe()
 *    - toEqual()
 *    - toBeTruthy() / toBeFalsy()
 */

test.describe('Aserciones de Página', () => {

  test('toHaveURL - Verificar URL', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // URL exacta
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // URL con regex (más flexible)
    await expect(page).toHaveURL(/saucedemo\.com/);
    
    // Login y verificar nueva URL
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verificar que la URL contiene "inventory"
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('toHaveTitle - Verificar título de pestaña', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Título exacto
    await expect(page).toHaveTitle('Swag Labs');
    
    // Título con regex
    await expect(page).toHaveTitle(/Swag/);
  });

});

test.describe('Aserciones de Visibilidad', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('toBeVisible - Elemento visible', async ({ page }) => {
    // Verificar que elementos del login son visibles
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('not.toBeVisible - Elemento NO visible', async ({ page }) => {
    // El mensaje de error no debería ser visible al inicio
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
    
    // Intentar login sin credenciales
    await page.locator('[data-test="login-button"]').click();
    
    // Ahora SÍ debería ser visible
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('toBeEnabled / toBeDisabled', async ({ page }) => {
    // El botón de login debería estar habilitado
    await expect(page.locator('[data-test="login-button"]')).toBeEnabled();
    
    // Nota: En SauceDemo el botón siempre está habilitado
    // En otras apps, podría estar deshabilitado hasta llenar campos
  });

});

test.describe('Aserciones de Texto', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('toHaveText - Texto exacto', async ({ page }) => {
    // Verificar texto exacto
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    
    // Primer producto
    const primerNombre = page.locator('[data-test="inventory-item-name"]').first();
    await expect(primerNombre).toHaveText('Sauce Labs Backpack');
  });

  test('toContainText - Texto parcial', async ({ page }) => {
    // Verificar que contiene cierto texto
    const primerDescripcion = page.locator('[data-test="inventory-item-desc"]').first();
    await expect(primerDescripcion).toContainText('carry.allทhe.things');
    
    // También funciona para verificar que NO contiene
    await expect(primerDescripcion).not.toContainText('ERROR');
  });

  test('toHaveValue - Valor de input', async ({ page }) => {
    // En la página de productos no hay inputs
    // Vamos al carrito para ver el ejemplo
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Llenar un campo
    await page.locator('[data-test="firstName"]').fill('Juan');
    
    // Verificar que el input tiene el valor correcto
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Juan');
  });

});

test.describe('Aserciones de Cantidad', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('toHaveCount - Cantidad de elementos', async ({ page }) => {
    // Verificar que hay 6 productos
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(6);
    
    // Verificar que hay 6 botones de agregar
    const botonesAgregar = page.locator('button:has-text("Add to cart")');
    await expect(botonesAgregar).toHaveCount(6);
  });

  test('count() para lógica condicional', async ({ page }) => {
    // A veces necesitamos el número para lógica
    const cantidad = await page.locator('[data-test="inventory-item"]').count();
    
    // Usar expect genérico
    expect(cantidad).toBe(6);
    expect(cantidad).toBeGreaterThan(0);
  });

});

test.describe('Aserciones de Atributos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('toHaveAttribute - Verificar atributo', async ({ page }) => {
    // Verificar que el input tiene type="text"
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('type', 'text');
    
    // Verificar que el password tiene type="password"
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
    
    // Verificar que el botón tiene id específico
    await expect(page.locator('[data-test="login-button"]')).toHaveAttribute('id', 'login-button');
  });

  test('toHaveClass - Verificar clase CSS', async ({ page }) => {
    // Verificar que el formulario tiene cierta clase
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(loginButton).toHaveClass(/btn_action/);
  });

});

test.describe('Aserciones con Timeout Personalizado', () => {

  test('Timeout personalizado en expect', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Por defecto, expect espera 5 segundos
    // Podemos cambiarlo para elementos lentos:
    await expect(page.locator('[data-test="login-button"]')).toBeVisible({
      timeout: 10000  // 10 segundos
    });
    
    // O para verificaciones más estrictas:
    await expect(page.locator('[data-test="username"]')).toBeVisible({
      timeout: 2000   // Solo 2 segundos
    });
  });

});
