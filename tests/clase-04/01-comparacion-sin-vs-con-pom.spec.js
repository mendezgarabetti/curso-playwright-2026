// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 4: Comparación - Sin POM vs Con POM
 * =========================================
 * Este archivo muestra el ANTES y DESPUÉS de aplicar Page Object Model.
 * 
 * Observá las diferencias en:
 * - Legibilidad del código
 * - Reutilización de selectores
 * - Mantenibilidad
 */

// ═══════════════════════════════════════════════════════════════════════════
// ANTES: Tests SIN Page Object Model
// ═══════════════════════════════════════════════════════════════════════════

test.describe('❌ SIN POM: Tests con selectores repetidos', () => {

  test('Login exitoso - sin POM', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login fallido - sin POM', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Los mismos selectores repetidos en cada test
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Agregar al carrito - sin POM', async ({ page }) => {
    // Setup: Login (código repetido)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Test
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Checkout completo - sin POM', async ({ page }) => {
    // Setup: Login (código repetido OTRA VEZ)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar producto
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    
    // Checkout
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Finalizar
    await page.locator('[data-test="finish"]').click();
    
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

});

/**
 * PROBLEMAS del código anterior:
 * 
 * 1. SELECTORES REPETIDOS
 *    - '[data-test="username"]' aparece en cada test
 *    - Si cambia el selector, hay que modificar TODOS los tests
 * 
 * 2. CÓDIGO DUPLICADO
 *    - El login se repite en cada test
 *    - El checkout tiene pasos que podrían reutilizarse
 * 
 * 3. DIFÍCIL DE LEER
 *    - No queda claro qué hace cada paso
 *    - Mezcla lógica de test con detalles de implementación
 * 
 * 4. DIFÍCIL DE MANTENER
 *    - Cambio en la UI = cambios en muchos archivos
 *    - Propenso a errores de copiar/pegar
 */

// ═══════════════════════════════════════════════════════════════════════════
// DESPUÉS: Tests CON Page Object Model
// ═══════════════════════════════════════════════════════════════════════════

// Importar Page Objects
const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('./pages');

test.describe('✅ CON POM: Tests limpios y mantenibles', () => {

  test('Login exitoso - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login fallido - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsLockedUser();
    
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Agregar al carrito - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Setup
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    // Test - ¡Mucho más legible!
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Checkout completo - con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    // Agregar producto
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    // Ir al carrito
    await inventoryPage.goToCart();
    
    // Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    
    // Finalizar
    await checkoutPage.finish();
    
    // Verificar
    const message = await checkoutPage.getSuccessMessage();
    expect(message).toBe('Thank you for your order!');
  });

});

/**
 * BENEFICIOS del código con POM:
 * 
 * 1. SELECTORES CENTRALIZADOS
 *    - Cada selector está definido UNA VEZ en el Page Object
 *    - Si cambia, solo modificás un archivo
 * 
 * 2. CÓDIGO REUTILIZABLE
 *    - loginAsStandardUser() se puede usar en cualquier test
 *    - addToCart(), fillWithTestData(), etc.
 * 
 * 3. FÁCIL DE LEER
 *    - El test lee como instrucciones en lenguaje natural
 *    - "Login, agregar al carrito, ir al checkout"
 * 
 * 4. FÁCIL DE MANTENER
 *    - Cambio en la UI = cambio en UN archivo
 *    - Los tests no cambian
 */
