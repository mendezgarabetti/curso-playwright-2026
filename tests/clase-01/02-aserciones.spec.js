// @ts-check
import { test, expect } from '@playwright/test';

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
    await expect(primerDescripcion).toContainText('carry.allTheThings()');
    
    
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
    const botonesAgregar = page.locator('[data-test^="add-to-cart"]');
    await expect(botonesAgregar).toHaveCount(6);
  });

});

test.describe('Aserciones de Atributos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('toHaveAttribute - Verificar atributos', async ({ page }) => {
    // Verificar tipo de input
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('type', 'text');
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
    
    // Verificar placeholder
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', 'Username');
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
