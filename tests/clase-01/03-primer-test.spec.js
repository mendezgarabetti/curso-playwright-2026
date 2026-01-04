// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 1: Primer Test - Login Básico
 * ====================================
 * Este es el primer test que escribimos juntos.
 * 
 * Estructura de un test:
 * 1. ARRANGE (Preparar) - Ir a la página
 * 2. ACT (Actuar) - Realizar acciones
 * 3. ASSERT (Verificar) - Comprobar resultados
 * 
 * Usamos page.pause() para demostración en vivo.
 */

test.describe('Login Básico en SauceDemo', () => {

  test('Login exitoso con usuario estándar', async ({ page }) => {
    // ══════════════════════════════════════════════════════════════════════
    // 1. ARRANGE - Preparar
    // ══════════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    
    // Descomentar para pausar y ver el navegador:
    // await page.pause();

    // ══════════════════════════════════════════════════════════════════════
    // 2. ACT - Actuar
    // ══════════════════════════════════════════════════════════════════════
    
    // Llenar el formulario de login
    // Usamos selectores data-test (Nivel 1 de calidad)
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // Hacer clic en el botón de login
    await page.locator('[data-test="login-button"]').click();

    // ══════════════════════════════════════════════════════════════════════
    // 3. ASSERT - Verificar
    // ══════════════════════════════════════════════════════════════════════
    
    // Verificar que llegamos a la página de productos
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Verificar que el título dice "Products"
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('Login exitoso + agregar producto al carrito', async ({ page }) => {
    // ══════════════════════════════════════════════════════════════════════
    // 1. ARRANGE + ACT - Login
    // ══════════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // ══════════════════════════════════════════════════════════════════════
    // 2. ACT - Agregar producto al carrito
    // ══════════════════════════════════════════════════════════════════════
    
    // Agregar la mochila (backpack) al carrito
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // ══════════════════════════════════════════════════════════════════════
    // 3. ASSERT - Verificar carrito
    // ══════════════════════════════════════════════════════════════════════
    
    // Verificar que el badge del carrito muestra "1"
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });

});

test.describe('Casos Negativos - Errores de Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Error con usuario bloqueado', async ({ page }) => {
    // Intentar login con usuario bloqueado
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verificar mensaje de error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Sorry, this user has been locked out');
  });

  test('Error con credenciales vacías', async ({ page }) => {
    // Intentar login sin llenar campos
    await page.locator('[data-test="login-button"]').click();
    
    // Verificar mensaje de error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username is required');
  });

  test('Error con password vacío', async ({ page }) => {
    // Intentar login solo con usuario
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    
    // Verificar mensaje de error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Password is required');
  });

  test('Error con credenciales incorrectas', async ({ page }) => {
    // Intentar login con credenciales inválidas
    await page.locator('[data-test="username"]').fill('usuario_falso');
    await page.locator('[data-test="password"]').fill('password_falso');
    await page.locator('[data-test="login-button"]').click();
    
    // Verificar mensaje de error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username and password do not match');
  });

});
