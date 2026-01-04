// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO CLASE 1: Primeros Pasos con Playwright                     ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Aplicación: SauceDemo (https://www.saucedemo.com)                    ║
 * ║                                                                       ║
 * ║  Objetivo: Practicar selectores, acciones y aserciones básicas        ║
 * ║                                                                       ║
 * ║  Instrucciones:                                                       ║
 * ║  1. Completar los TODO en cada test                                   ║
 * ║  2. Ejecutar con: npx playwright test ejercicio --project=chromium    ║
 * ║  3. Todos los tests deben pasar                                       ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('Ejercicio 1: Login', () => {

  test('1.1 Login exitoso', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // TODO: Llenar el campo username con 'standard_user'
    // Pista: usa page.locator('[data-test="username"]')
    
    // TODO: Llenar el campo password con 'secret_sauce'
    
    // TODO: Hacer clic en el botón de login
    
    // TODO: Verificar que la URL contiene 'inventory.html'
    // Pista: await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('1.2 Error con usuario bloqueado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // TODO: Llenar username con 'locked_out_user'
    
    // TODO: Llenar password con 'secret_sauce'
    
    // TODO: Hacer clic en login
    
    // TODO: Verificar que aparece el mensaje de error
    // Pista: el selector es '[data-test="error"]'
    
    // TODO: Verificar que el mensaje contiene 'locked out'
  });

});

test.describe('Ejercicio 2: Productos', () => {

  test.beforeEach(async ({ page }) => {
    // Este código se ejecuta ANTES de cada test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('2.1 Verificar cantidad de productos', async ({ page }) => {
    // TODO: Verificar que hay exactamente 6 productos en la página
    // Pista: usa toHaveCount(6) con el selector '[data-test="inventory-item"]'
  });

  test('2.2 Verificar título de la página', async ({ page }) => {
    // TODO: Verificar que el título de la página dice 'Products'
    // Pista: el selector es '[data-test="title"]'
  });

  test('2.3 Agregar producto al carrito', async ({ page }) => {
    // TODO: Agregar la mochila (backpack) al carrito
    // Pista: el selector es '[data-test="add-to-cart-sauce-labs-backpack"]'
    
    // TODO: Verificar que el badge del carrito muestra '1'
    // Pista: el selector es '[data-test="shopping-cart-badge"]'
  });

  test('2.4 Agregar y quitar producto', async ({ page }) => {
    // TODO: Agregar la mochila al carrito
    
    // TODO: Verificar que el badge muestra '1'
    
    // TODO: Quitar la mochila del carrito
    // Pista: el botón cambia a '[data-test="remove-sauce-labs-backpack"]'
    
    // TODO: Verificar que el badge ya no está visible
    // Pista: usa .not.toBeVisible()
  });

});

test.describe('Ejercicio 3: Carrito', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('3.1 Navegar al carrito', async ({ page }) => {
    // TODO: Agregar un producto al carrito
    
    // TODO: Hacer clic en el ícono del carrito
    // Pista: el selector es '.shopping_cart_link'
    
    // TODO: Verificar que la URL contiene 'cart.html'
  });

  test('3.2 Verificar producto en carrito', async ({ page }) => {
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    
    // TODO: Verificar que hay 1 producto en el carrito
    // Pista: usa toHaveCount() con '[data-test="inventory-item"]'
    
    // TODO: Verificar que el producto es "Sauce Labs Backpack"
    // Pista: busca el texto dentro del carrito
  });

});

test.describe('Ejercicio 4: BONUS - Flujo Completo', () => {

  test('4.1 Checkout completo', async ({ page }) => {
    // Este ejercicio es más desafiante
    // Completa el flujo de compra completo
    
    // 1. Login
    await page.goto('https://www.saucedemo.com/');
    // TODO: completar login
    
    // 2. Agregar producto
    // TODO: agregar cualquier producto al carrito
    
    // 3. Ir al carrito
    // TODO: navegar al carrito
    
    // 4. Iniciar checkout
    // TODO: click en el botón checkout
    // Pista: '[data-test="checkout"]'
    
    // 5. Llenar formulario
    // TODO: llenar firstName, lastName, postalCode
    
    // TODO: click en continue
    // Pista: '[data-test="continue"]'
    
    // 6. Finalizar
    // TODO: click en finish
    // Pista: '[data-test="finish"]'
    
    // 7. Verificar éxito
    // TODO: verificar que aparece "Thank you for your order!"
    // Pista: '[data-test="complete-header"]'
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * 
 * ✅ Todos los tests pasan
 * ✅ Usaste selectores data-test (Nivel 1)
 * ✅ Cada test tiene al menos una aserción
 * ✅ No hay código comentado ni TODOs pendientes
 * 
 * BONUS:
 * ✅ Usaste test.beforeEach para evitar repetición
 * ✅ Completaste el ejercicio 4 (checkout)
 */
