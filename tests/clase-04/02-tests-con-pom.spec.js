// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('./pages');

/**
 * CLASE 4: Tests de Ejemplo con Page Objects
 * ==========================================
 * Suite completa usando POM para todos los flujos principales.
 */

test.describe('Autenticación', () => {

  test('Login con usuario estándar', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login con usuario bloqueado muestra error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsLockedUser();
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('Login con credenciales vacías muestra error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('', '');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('Login sin password muestra error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', '');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

});

test.describe('Inventario', () => {

  // Setup: Login antes de cada test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('Página muestra 6 productos', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('Ordenar productos por precio (bajo a alto)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.sortBy('lohi');
    
    const firstPrice = await inventoryPage.getFirstProductPrice();
    expect(firstPrice).toBe('$7.99');
  });

  test('Ordenar productos por precio (alto a bajo)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.sortBy('hilo');
    
    const firstPrice = await inventoryPage.getFirstProductPrice();
    expect(firstPrice).toBe('$49.99');
  });

  test('Ordenar productos por nombre (Z a A)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.sortBy('za');
    
    const firstName = await inventoryPage.getFirstProductName();
    expect(firstName).toContain('Test.allTheThings');
  });

  test('Agregar producto al carrito', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('Agregar múltiples productos al carrito', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.addMultipleToCart([
      'sauce-labs-backpack',
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt'
    ]);
    
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(3);
  });

  test('Remover producto del carrito', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.removeFromCart('sauce-labs-backpack');
    
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(0);
  });

});

test.describe('Carrito', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    // Agregar productos para los tests
    await inventoryPage.addMultipleToCart([
      'sauce-labs-backpack',
      'sauce-labs-bike-light'
    ]);
    await inventoryPage.goToCart();
  });

  test('Carrito muestra productos agregados', async ({ page }) => {
    const cartPage = new CartPage(page);
    
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
    
    const hasBackpack = await cartPage.hasProduct('Backpack');
    const hasBikeLight = await cartPage.hasProduct('Bike Light');
    
    expect(hasBackpack).toBe(true);
    expect(hasBikeLight).toBe(true);
  });

  test('Remover item del carrito', async ({ page }) => {
    const cartPage = new CartPage(page);
    
    await cartPage.removeItem('sauce-labs-backpack');
    
    const count = await cartPage.getItemCount();
    expect(count).toBe(1);
    
    const hasBackpack = await cartPage.hasProduct('Backpack');
    expect(hasBackpack).toBe(false);
  });

  test('Continuar comprando vuelve al inventario', async ({ page }) => {
    const cartPage = new CartPage(page);
    
    await cartPage.continueShopping();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('Formulario vacío muestra error', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.continue();
    
    expect(await checkoutPage.hasError()).toBe(true);
    const error = await checkoutPage.getErrorText();
    expect(error).toContain('First Name is required');
  });

  test('Formulario sin apellido muestra error', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.fillInformation({
      firstName: 'Test',
      lastName: '',
      postalCode: ''
    });
    await checkoutPage.continue();
    
    const error = await checkoutPage.getErrorText();
    expect(error).toContain('Last Name is required');
  });

  test('Formulario completo avanza al resumen', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    
    const step = await checkoutPage.getCurrentStep();
    expect(step).toBe('overview');
  });

  test('Resumen muestra totales correctos', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    
    // Backpack cuesta $29.99
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toBe('$29.99');
    
    // Verificar que hay un total
    const total = await checkoutPage.getTotal();
    expect(total).not.toBe('');
  });

  test('Finalizar compra muestra confirmación', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    await checkoutPage.finish();
    
    const isComplete = await checkoutPage.isOrderComplete();
    expect(isComplete).toBe(true);
    
    const message = await checkoutPage.getSuccessMessage();
    expect(message).toBe('Thank you for your order!');
  });

});

test.describe('Happy Path Completo con POM', () => {

  test('Flujo E2E: Login → Productos → Carrito → Checkout → Confirmación', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login
    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.loginAsStandardUser();
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    // 2. Agregar productos
    await test.step('Agregar productos al carrito', async () => {
      await inventoryPage.addMultipleToCart([
        'sauce-labs-backpack',
        'sauce-labs-bike-light'
      ]);
      const count = await inventoryPage.getCartCount();
      expect(count).toBe(2);
    });

    // 3. Ir al carrito
    await test.step('Verificar carrito', async () => {
      await inventoryPage.goToCart();
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBe(2);
    });

    // 4. Checkout
    await test.step('Completar checkout', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillInformation({
        firstName: 'Juan',
        lastName: 'Pérez',
        postalCode: '5000'
      });
      await checkoutPage.continue();
    });

    // 5. Verificar resumen
    await test.step('Verificar resumen', async () => {
      const itemCount = await checkoutPage.getItemCount();
      expect(itemCount).toBe(2);
      
      // $29.99 + $9.99 = $39.98
      const subtotal = await checkoutPage.getSubtotal();
      expect(subtotal).toBe('$39.98');
    });

    // 6. Finalizar
    await test.step('Finalizar compra', async () => {
      await checkoutPage.finish();
      
      const isComplete = await checkoutPage.isOrderComplete();
      expect(isComplete).toBe(true);
    });
  });

});
