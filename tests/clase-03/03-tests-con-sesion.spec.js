// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 3: Tests que Reutilizan la Sesión
 * =======================================
 * Estos tests asumen que ya hay una sesión activa.
 * NO hacen login porque usan el storageState configurado.
 */

test.describe('Tests con Sesión Reutilizada (Ejemplo)', () => {

  test.beforeEach(async ({ page }) => {
    // Fallback: hacer login si no hay storageState configurado
    await page.goto('https://www.saucedemo.com/');
    
    const url = page.url();
    if (url.includes('inventory.html')) {
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
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

  test('Logout funciona correctamente', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    // Abrir menú
    await page.locator('#react-burger-menu-btn').click();
    
    // Click en logout
    await page.locator('#logout_sidebar_link').click();
    
    // Verificar que volvimos al login
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});
