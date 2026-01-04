// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO CLASE 2: Flujo de Checkout Completo                        ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Objetivo: Completar un flujo E2E de compra con 3 productos           ║
 * ║                                                                       ║
 * ║  Requisitos:                                                          ║
 * ║  - Agregar 3 productos al carrito                                     ║
 * ║  - Validar cada paso del proceso                                      ║
 * ║  - Verificar el mensaje final "Thank you for your order!"             ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('EJERCICIO: Checkout de 3 Productos', () => {

  test('Comprar Backpack, Bike Light y T-Shirt', async ({ page }) => {
    
    // ═══════════════════════════════════════════════════════════════════
    // PASO 1: LOGIN
    // ═══════════════════════════════════════════════════════════════════
    await page.goto('https://www.saucedemo.com/');
    
    // TODO: Completar el login con standard_user / secret_sauce
    
    // TODO: Verificar que llegamos a la página de productos

    // ═══════════════════════════════════════════════════════════════════
    // PASO 2: AGREGAR 3 PRODUCTOS
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Agregar Sauce Labs Backpack
    // Pista: '[data-test="add-to-cart-sauce-labs-backpack"]'
    
    // TODO: Agregar Sauce Labs Bike Light
    // Pista: '[data-test="add-to-cart-sauce-labs-bike-light"]'
    
    // TODO: Agregar Sauce Labs Bolt T-Shirt
    // Pista: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]'
    
    // TODO: Verificar que el badge del carrito muestra "3"

    // ═══════════════════════════════════════════════════════════════════
    // PASO 3: IR AL CARRITO
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Click en el carrito
    // Pista: '.shopping_cart_link'
    
    // TODO: Verificar que hay 3 productos en el carrito
    // Pista: '[data-test="inventory-item"]'

    // ═══════════════════════════════════════════════════════════════════
    // PASO 4: CHECKOUT - INFORMACIÓN
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Click en Checkout
    // Pista: '[data-test="checkout"]'
    
    // TODO: Llenar el formulario con:
    //   - First Name: Tu nombre
    //   - Last Name: Tu apellido
    //   - Postal Code: 12345
    
    // TODO: Click en Continue
    // Pista: '[data-test="continue"]'

    // ═══════════════════════════════════════════════════════════════════
    // PASO 5: CHECKOUT - RESUMEN
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Verificar que estamos en la página de resumen
    // Pista: URL contiene 'checkout-step-two'
    
    // TODO: Verificar que aparecen los 3 productos
    
    // TODO: Verificar el subtotal
    // Los precios son: Backpack $29.99, Bike Light $9.99, T-Shirt $15.99
    // Subtotal esperado: $55.97

    // ═══════════════════════════════════════════════════════════════════
    // PASO 6: FINALIZAR
    // ═══════════════════════════════════════════════════════════════════
    
    // TODO: Click en Finish
    // Pista: '[data-test="finish"]'
    
    // TODO: Verificar el mensaje "Thank you for your order!"
    // Pista: '[data-test="complete-header"]'
    
    // TODO: Verificar que el carrito está vacío (badge no visible)

  });

});

test.describe('EJERCICIO BONUS: Validar Precios', () => {

  test('Verificar que los precios individuales suman el total', async ({ page }) => {
    // Setup: Login y agregar productos
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar los 3 productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Ir al checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // TODO: Obtener todos los precios de los productos
    // Pista: page.locator('[data-test="inventory-item-price"]').allTextContents()
    
    // TODO: Obtener el subtotal
    // Pista: page.locator('[data-test="subtotal-label"]').textContent()
    
    // TODO: Verificar que la suma de precios individuales = subtotal
    // Nota: Los precios vienen como "$29.99", hay que parsearlos
    
    // PISTA para parsear:
    // const precioTexto = '$29.99';
    // const precioNumero = parseFloat(precioTexto.replace('$', ''));
    
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * 
 * ✅ El flujo completo funciona sin errores
 * ✅ Se agregan exactamente 3 productos
 * ✅ Hay validaciones en cada paso
 * ✅ El test termina con "Thank you for your order!"
 * 
 * BONUS:
 * ✅ Verificar que la suma de precios = subtotal
 */
