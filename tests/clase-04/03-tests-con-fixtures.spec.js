// @ts-check

/**
 * CLASE 4: Tests con Fixtures Personalizados
 * ==========================================
 * Usando los fixtures definidos en fixtures.js,
 * los tests son aún más limpios.
 */

// Importar test y expect desde nuestros fixtures (no de @playwright/test)
const { test, expect } = require('./fixtures');

test.describe('Tests con Fixtures: Page Objects Inyectados', () => {

  test('Login usando fixture loginPage', async ({ loginPage }) => {
    // loginPage ya está instanciado y listo
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    // Podemos acceder a los locators del Page Object
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
  });

  test('Inventario usando fixture inventoryPage', async ({ loginPage, inventoryPage }) => {
    // Setup
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    // Test
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Checkout usando múltiples fixtures', async ({ 
    loginPage, 
    inventoryPage, 
    cartPage, 
    checkoutPage 
  }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    
    await cartPage.proceedToCheckout();
    
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    await checkoutPage.finish();
    
    const isComplete = await checkoutPage.isOrderComplete();
    expect(isComplete).toBe(true);
  });

});

test.describe('Tests con Fixtures Avanzados: Estado Precargado', () => {

  test('Test en página ya autenticada', async ({ authenticatedPage }) => {
    // ¡Ya estamos logueados! No hay que hacer setup
    const inventoryPage = require('./pages').InventoryPage;
    const inventory = new inventoryPage(authenticatedPage);
    
    const count = await inventory.getProductCount();
    expect(count).toBe(6);
  });

  test('Test con producto ya en carrito', async ({ pageWithProduct, inventoryPage }) => {
    // Ya hay un producto en el carrito
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('Test directamente en checkout', async ({ pageAtCheckout, checkoutPage }) => {
    // Ya estamos en la página de checkout con un producto
    await checkoutPage.fillWithTestData();
    await checkoutPage.continue();
    
    const step = await checkoutPage.getCurrentStep();
    expect(step).toBe('overview');
  });

});

test.describe('Beneficios de usar Fixtures', () => {

  /**
   * BENEFICIO 1: Menos código repetitivo
   * 
   * Sin fixtures:
   *   test('...', async ({ page }) => {
   *     const loginPage = new LoginPage(page);
   *     const inventoryPage = new InventoryPage(page);
   *     const cartPage = new CartPage(page);
   *     // 3 líneas solo para instanciar
   *   });
   * 
   * Con fixtures:
   *   test('...', async ({ loginPage, inventoryPage, cartPage }) => {
   *     // Ya están listos
   *   });
   */

  /**
   * BENEFICIO 2: Fixtures con estado (authenticatedPage, pageWithProduct)
   * Permiten empezar el test en un punto avanzado del flujo.
   */

  /**
   * BENEFICIO 3: Tipado automático (con JSDoc o TypeScript)
   * El editor sabe qué métodos tiene cada Page Object.
   */

  /**
   * BENEFICIO 4: Reutilización a nivel de proyecto
   * Los fixtures se definen una vez y se usan en todos los tests.
   */

  test('Ejemplo: Combinando fixtures', async ({ 
    loginPage, 
    inventoryPage 
  }) => {
    // Este test es cortísimo gracias a los fixtures
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    
    await inventoryPage.sortBy('lohi');
    
    const firstPrice = await inventoryPage.getFirstProductPrice();
    expect(firstPrice).toBe('$7.99');
  });

});
