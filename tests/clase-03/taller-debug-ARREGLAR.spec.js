// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  TALLER DE DEPURACIÓN: 10 Tests Rotos para Arreglar                   ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Cada test tiene un bug intencional. Tu misión:                       ║
 * ║  1. Ejecutar el test y ver el error                                   ║
 * ║  2. Usar las herramientas de debug para investigar                    ║
 * ║  3. Arreglar el bug                                                   ║
 * ║  4. Verificar que pasa en verde                                       ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('🔴 BUG 1: Selector Incorrecto', () => {

  test('Login con selector mal escrito - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // 🐛 BUG: El selector tiene un typo
    // PISTA: Inspeccionar el HTML del input de usuario
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
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(5);
  });

});

test.describe('🔴 BUG 3: Falta Await', () => {

  test('Agregar producto sin await - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: Falta await en el click
    // PISTA: Sin await, el test no espera a que termine la acción
    page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

test.describe('🔴 BUG 4: Orden Incorrecto', () => {

  test('Checkout sin agregar producto - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: Vamos al carrito sin agregar producto primero
    // PISTA: El badge no existirá si no hay productos
    await page.locator('.shopping_cart_link').click();
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

});

test.describe('🔴 BUG 5: Texto Exacto vs Parcial', () => {

  test('Verificar mensaje de error - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: toHaveText espera el texto EXACTO
    // PISTA: El mensaje real es más largo. Usar toContainText
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
    // PISTA: 100ms no es suficiente para la navegación
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 100 });
  });

});

test.describe('🔴 BUG 7: Elemento Equivocado', () => {

  test('Click en elemento incorrecto - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 🐛 BUG: Click en el badge en lugar del link del carrito
    // PISTA: El badge es el número, no el ícono clickeable
    await page.locator('[data-test="shopping-cart-badge"]').click();
    
    await expect(page).toHaveURL(/.*cart.html/);
  });

});

test.describe('🔴 BUG 8: Condición de Carrera', () => {

  test('Verificar antes de que exista - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // 🐛 BUG: Verificamos el título antes de hacer click
    // PISTA: El título "Products" solo aparece después del login
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    
    await page.locator('[data-test="login-button"]').click();
  });

});

test.describe('🔴 BUG 9: URL Mal Escrita', () => {

  test('Navegar a URL incorrecta - ARREGLAR', async ({ page }) => {
    // 🐛 BUG: La URL tiene un typo
    // PISTA: Verificar el dominio correcto
    await page.goto('https://www.sourcedemo.com/');
    
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('🔴 BUG 10: Lógica Incorrecta', () => {

  test('Badge vacío no existe - ARREGLAR', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // 🐛 BUG: Si no hay productos, el badge NO EXISTE (no dice "0")
    // PISTA: Verificar que NOT toBeVisible, no que tenga texto "0"
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('0');
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * 
 * ✅ Los 10 tests pasan en verde
 * ✅ Usaste --debug o --ui para investigar
 * ✅ Entendés por qué falló cada uno
 */
