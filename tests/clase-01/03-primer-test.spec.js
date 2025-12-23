// @ts-check
const { test, expect } = require('@playwright/test');

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
    // 3. ASSERT - Verificar
    // ══════════════════════════════════════════════════════════════════════
    
    // Verificar que el carrito muestra "1"
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Verificar que el botón cambió a "Remove"
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

});

test.describe('Casos Negativos de Login', () => {

  test('Error al intentar login con usuario bloqueado', async ({ page }) => {
    // ══════════════════════════════════════════════════════════════════════
    // 1. ARRANGE
    // ══════════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');

    // ══════════════════════════════════════════════════════════════════════
    // 2. ACT - Usar usuario que sabemos que está bloqueado
    // ══════════════════════════════════════════════════════════════════════
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // ══════════════════════════════════════════════════════════════════════
    // 3. ASSERT - Verificar que aparece el error
    // ══════════════════════════════════════════════════════════════════════
    const mensajeError = page.locator('[data-test="error"]');
    
    // El mensaje debe ser visible
    await expect(mensajeError).toBeVisible();
    
    // El mensaje debe contener el texto correcto
    await expect(mensajeError).toContainText('Sorry, this user has been locked out');
  });

  test('Error al intentar login sin credenciales', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Click en login sin llenar nada
    await page.locator('[data-test="login-button"]').click();
    
    // Debe mostrar error
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('Error al intentar login solo con usuario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Solo llenar usuario
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    
    // Debe mostrar error de password
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('Error con credenciales incorrectas', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Credenciales inventadas
    await page.locator('[data-test="username"]').fill('usuario_falso');
    await page.locator('[data-test="password"]').fill('password_falso');
    await page.locator('[data-test="login-button"]').click();
    
    // Debe mostrar error genérico
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('do not match');
  });

});

/**
 * USUARIOS DISPONIBLES EN SAUCEDEMO:
 * 
 * | Usuario            | Comportamiento                |
 * |--------------------|-------------------------------|
 * | standard_user      | Funciona normalmente          |
 * | locked_out_user    | Bloqueado, no puede entrar    |
 * | problem_user       | Tiene bugs visuales           |
 * | performance_user   | Responde lento                |
 * | error_user         | Genera errores aleatorios     |
 * | visual_user        | Diferencias visuales          |
 * 
 * Todos usan la misma contraseña: secret_sauce
 */
