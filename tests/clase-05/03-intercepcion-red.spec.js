// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 5: Intercepción de Red (Network Mocking)
 * ==============================================
 * Playwright permite interceptar requests de red y:
 * - Modificar requests antes de enviarlos
 * - Modificar responses antes de entregarlos
 * - Bloquear requests completamente
 * - Simular respuestas sin hacer requests reales
 * 
 * ¿Por qué interceptar?
 * - Simular errores del servidor (500, 404, timeout)
 * - Probar estados que son difíciles de reproducir
 * - Acelerar tests (no esperar al servidor real)
 * - Aislar el frontend del backend
 */

test.describe('Intercepción Básica: page.route()', () => {

  test('Interceptar y observar requests', async ({ page }) => {
    // Array para guardar las URLs interceptadas
    const interceptedUrls = [];
    
    // Interceptar TODOS los requests
    await page.route('**/*', async (route) => {
      interceptedUrls.push(route.request().url());
      // Continuar con el request normal
      await route.continue();
    });
    
    await page.goto('https://www.saucedemo.com/');
    
    // Verificar que interceptamos varios recursos
    console.log('URLs interceptadas:', interceptedUrls.length);
    expect(interceptedUrls.length).toBeGreaterThan(0);
    
    // Verificar que incluye la página principal
    expect(interceptedUrls.some(url => url.includes('saucedemo.com'))).toBe(true);
  });

  test('Interceptar solo ciertos tipos de recursos', async ({ page }) => {
    const imageUrls = [];
    
    // Interceptar solo imágenes
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', async (route) => {
      imageUrls.push(route.request().url());
      await route.continue();
    });
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    console.log('Imágenes cargadas:', imageUrls.length);
  });

  test('Bloquear recursos (acelerar tests)', async ({ page }) => {
    // Bloquear imágenes para acelerar el test
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
    
    // Bloquear fuentes
    await page.route('**/*.{woff,woff2,ttf}', route => route.abort());
    
    // Bloquear analytics (si hubiera)
    await page.route('**/analytics**', route => route.abort());
    await page.route('**/google-analytics**', route => route.abort());
    
    await page.goto('https://www.saucedemo.com/');
    
    // La página carga más rápido sin recursos pesados
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('Mocking de Responses', () => {

  test('Simular respuesta de API', async ({ page }) => {
    // Interceptar un endpoint específico y devolver datos mock
    await page.route('**/api/inventory', async (route) => {
      // Devolver datos simulados
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Producto Mock 1', price: 9.99 },
          { id: 2, name: 'Producto Mock 2', price: 19.99 }
        ])
      });
    });
    
    // Si la app hiciera un request a /api/inventory,
    // recibiría nuestros datos mock
  });

  test('Simular error 500 del servidor', async ({ page }) => {
    // Configurar el mock ANTES de navegar
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'El servidor no está disponible'
        })
      });
    });
    
    // Nota: SauceDemo no usa APIs reales, esto es demostrativo
  });

  test('Simular error 404', async ({ page }) => {
    await page.route('**/api/product/*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Not Found',
          message: 'Producto no encontrado'
        })
      });
    });
  });

  test('Simular timeout/conexión lenta', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      // Simular demora de 5 segundos
      await new Promise(resolve => setTimeout(resolve, 5000));
      await route.continue();
    });
    
    // El test esperaría 5 segundos antes de continuar
  });

});

test.describe('Modificar Responses', () => {

  test('Interceptar y modificar response', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users/1', async (route) => {
      // Obtener la respuesta real
      const response = await route.fetch();
      const json = await response.json();
      
      // Modificar los datos
      json.name = 'Usuario Modificado';
      json.email = 'modificado@test.com';
      
      // Devolver la respuesta modificada
      await route.fulfill({
        response,
        body: JSON.stringify(json)
      });
    });
    
    // Navegar a una página que use esta API
    // Los datos llegarían modificados
  });

  test('Agregar headers a la respuesta', async ({ page }) => {
    await page.route('**/*', async (route) => {
      const response = await route.fetch();
      
      // Agregar headers personalizados
      const headers = {
        ...response.headers(),
        'X-Test-Header': 'valor-de-prueba'
      };
      
      await route.fulfill({
        response,
        headers
      });
    });
    
    await page.goto('https://www.saucedemo.com/');
  });

});

test.describe('Casos de Uso Prácticos', () => {

  test('Test de manejo de errores en UI', async ({ page }) => {
    // Este ejemplo muestra cómo probar que la UI
    // maneja correctamente un error del servidor
    
    // Primero hacemos login normalmente
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // En una app real con APIs, podríamos hacer:
    // await page.route('**/api/checkout', route => {
    //   route.fulfill({ status: 500, body: 'Server Error' });
    // });
    // 
    // Y luego verificar que la UI muestra un mensaje de error apropiado
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Acelerar tests bloqueando recursos innecesarios', async ({ page }) => {
    // Bloquear todo lo que no sea esencial
    await page.route('**/*', async (route) => {
      const resourceType = route.request().resourceType();
      
      // Solo permitir documentos, scripts y hojas de estilo
      if (['document', 'script', 'stylesheet', 'xhr', 'fetch'].includes(resourceType)) {
        await route.continue();
      } else {
        await route.abort();
      }
    });
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});
