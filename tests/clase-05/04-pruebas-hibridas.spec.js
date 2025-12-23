// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 5: Pruebas Híbridas (API + UI)
 * ====================================
 * Las pruebas más poderosas combinan:
 * - API para SETUP (preparar datos rápidamente)
 * - UI para VERIFICACIÓN (lo que ve el usuario)
 * - API para TEARDOWN (limpiar después)
 * 
 * Esto da lo mejor de ambos mundos:
 * - Velocidad de las pruebas de API
 * - Realismo de las pruebas de UI
 */

test.describe('Patrón Híbrido: API Setup + UI Test', () => {

  test('Crear dato vía API, verificar en UI', async ({ request, page }) => {
    // ═══════════════════════════════════════════════════════════════
    // PASO 1: Setup via API (rápido)
    // ═══════════════════════════════════════════════════════════════
    
    // En una app real, crearíamos datos vía API:
    // const response = await request.post('/api/products', {
    //   data: { name: 'Producto de Test', price: 99.99 }
    // });
    // const product = await response.json();
    
    // Para esta demo, usamos JSONPlaceholder
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Post creado vía API',
        body: 'Este post fue creado durante el setup del test',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(201);
    const createdPost = await response.json();
    console.log('📍 Post creado con ID:', createdPost.id);
    
    // ═══════════════════════════════════════════════════════════════
    // PASO 2: Test de UI
    // ═══════════════════════════════════════════════════════════════
    
    // En una app real, navegaríamos a la página del producto:
    // await page.goto(`/products/${product.id}`);
    // await expect(page.locator('.product-name')).toHaveText('Producto de Test');
    
    // Para esta demo, hacemos el flujo de SauceDemo
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // ═══════════════════════════════════════════════════════════════
    // PASO 3: Teardown vía API (opcional, para limpiar)
    // ═══════════════════════════════════════════════════════════════
    
    // await request.delete(`/api/products/${product.id}`);
  });

  test('Login vía API, continuar test en UI', async ({ request, page, context }) => {
    /**
     * CONCEPTO: Autenticación vía API
     * 
     * En lugar de hacer login por UI (lento), podemos:
     * 1. Obtener token/cookies vía API
     * 2. Inyectar esas cookies en el navegador
     * 3. Continuar el test ya autenticado
     * 
     * SauceDemo no tiene API de login, pero el patrón sería:
     */
    
    // const loginResponse = await request.post('/api/auth/login', {
    //   data: { username: 'user', password: 'pass' }
    // });
    // const { token } = await loginResponse.json();
    // 
    // await context.addCookies([{
    //   name: 'auth_token',
    //   value: token,
    //   domain: 'example.com',
    //   path: '/'
    // }]);
    // 
    // await page.goto('/dashboard'); // Ya estaríamos logueados
    
    // Demo con SauceDemo (login normal porque no tiene API)
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

});

test.describe('Patrón Híbrido: UI Action + API Verification', () => {

  test('Acción en UI, verificar estado vía API', async ({ page, request }) => {
    // ═══════════════════════════════════════════════════════════════
    // PASO 1: Realizar acción en UI
    // ═══════════════════════════════════════════════════════════════
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Agregar producto al carrito
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Verificar en UI
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // ═══════════════════════════════════════════════════════════════
    // PASO 2: Verificar estado vía API (en una app real)
    // ═══════════════════════════════════════════════════════════════
    
    // En una app con API real:
    // const cartResponse = await request.get('/api/cart', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // const cart = await cartResponse.json();
    // expect(cart.items).toHaveLength(1);
    // expect(cart.items[0].productId).toBe('sauce-labs-backpack');
    
    // Demo: verificamos con JSONPlaceholder (simulado)
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);
  });

});

test.describe('Patrón Híbrido: Preparar Escenarios Complejos', () => {

  test('Escenario: Usuario con historial de compras', async ({ request, page }) => {
    /**
     * Escenario: Probar que un usuario VIP ve descuentos especiales
     * 
     * Sin API: Tendríamos que hacer 10 compras manualmente
     * Con API: Creamos el historial en milisegundos
     */
    
    // Setup vía API (simulado)
    // await request.post('/api/users/1/purchases', {
    //   data: [
    //     { productId: 'backpack', date: '2024-01-15' },
    //     { productId: 'bike-light', date: '2024-02-20' },
    //     // ... más compras para alcanzar status VIP
    //   ]
    // });
    
    // Ahora el usuario tiene status VIP
    // await page.goto('/products');
    // await expect(page.locator('.vip-badge')).toBeVisible();
    // await expect(page.locator('.discount-tag')).toContainText('10% VIP');
    
    // Demo con SauceDemo
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Escenario: Probar sistema vacío', async ({ request, page }) => {
    /**
     * Escenario: ¿Qué muestra la app si no hay productos?
     * 
     * Difícil de probar si siempre hay datos
     * Fácil con mocking de la respuesta
     */
    
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]) // Array vacío
      });
    });
    
    // La UI debería mostrar "No hay productos disponibles"
    // await page.goto('/products');
    // await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('Escenario: Probar paginación', async ({ request, page }) => {
    /**
     * Escenario: Verificar que la paginación funciona con muchos items
     * 
     * Con API: Podemos simular 1000 productos sin crearlos realmente
     */
    
    const manyProducts = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Producto ${i + 1}`,
      price: (Math.random() * 100).toFixed(2)
    }));
    
    await page.route('**/api/products', async (route) => {
      const url = new URL(route.request().url());
      const page_num = parseInt(url.searchParams.get('page') || '1');
      const per_page = parseInt(url.searchParams.get('per_page') || '10');
      
      const start = (page_num - 1) * per_page;
      const paginatedProducts = manyProducts.slice(start, start + per_page);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: paginatedProducts,
          total: manyProducts.length,
          page: page_num,
          per_page: per_page
        })
      });
    });
    
    // Ahora podemos probar la paginación con datos simulados
  });

});

test.describe('Beneficios del Enfoque Híbrido', () => {

  /**
   * COMPARACIÓN DE TIEMPOS (aproximados):
   * 
   * Test E2E puro (todo vía UI):
   * - Login: 3 segundos
   * - Crear producto: 5 segundos
   * - Agregar al carrito: 2 segundos
   * - Checkout: 8 segundos
   * - TOTAL: ~18 segundos
   * 
   * Test híbrido (API setup + UI verification):
   * - Setup vía API: 0.5 segundos
   * - UI verification: 3 segundos
   * - TOTAL: ~3.5 segundos
   * 
   * ¡5x más rápido!
   */

  test('Demo de velocidad: Solo verificación UI', async ({ page }) => {
    const startTime = Date.now();
    
    // Asumimos que el setup ya se hizo vía API
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Tiempo de ejecución: ${duration}ms`);
  });

});
