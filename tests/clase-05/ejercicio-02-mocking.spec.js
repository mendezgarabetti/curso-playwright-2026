// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO 2: Network Mocking e Intercepción                          ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Practicar intercepción de requests y mocking de responses            ║
 * ║                                                                       ║
 * ║  Usaremos SauceDemo para los tests de UI                              ║
 * ║  URL: https://www.saucedemo.com                                       ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('Ejercicio 1: Intercepción Básica', () => {

  test('1.1 Contar requests de imágenes', async ({ page }) => {
    // TODO: Crear un array para guardar las URLs de imágenes
    // TODO: Interceptar todos los requests de imágenes (png, jpg, jpeg)
    // TODO: Navegar a SauceDemo y hacer login
    // TODO: Imprimir cuántas imágenes se cargaron
    // TODO: Verificar que se cargaron más de 5 imágenes
    
    const imageUrls = [];
    
    // await page.route('**/*.{png,jpg,jpeg}', async (route) => {
    //   imageUrls.push(???);
    //   await route.continue();
    // });
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Esperar a que carguen las imágenes
    await page.waitForLoadState('networkidle');
    
    console.log('Imágenes cargadas:', imageUrls.length);
    // expect(imageUrls.length).toBeGreaterThan(5);
  });

  test('1.2 Bloquear imágenes para acelerar test', async ({ page }) => {
    // TODO: Bloquear TODAS las imágenes (abort)
    // TODO: Navegar y hacer login
    // TODO: Verificar que el test completa más rápido
    // TODO: Verificar que llegamos al inventario
    
    const startTime = Date.now();
    
    // await page.route('**/*.{png,jpg,jpeg,svg}', route => ???);
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    
    const duration = Date.now() - startTime;
    console.log(`Tiempo sin imágenes: ${duration}ms`);
  });

});

test.describe('Ejercicio 2: Mocking de Responses', () => {

  test('2.1 Simular respuesta de API con productos personalizados', async ({ page }) => {
    // TODO: Interceptar un endpoint de API ficticio '/api/products'
    // TODO: Devolver un JSON con 3 productos personalizados
    // TODO: Cada producto debe tener: id, name, price, image
    
    const mockProducts = [
      { id: 1, name: 'Producto Test 1', price: 19.99, image: 'test1.jpg' },
      { id: 2, name: 'Producto Test 2', price: 29.99, image: 'test2.jpg' },
      { id: 3, name: 'Producto Test 3', price: 39.99, image: 'test3.jpg' }
    ];
    
    // await page.route('**/api/products', async (route) => {
    //   await route.fulfill({
    //     status: ???,
    //     contentType: ???,
    //     body: ???
    //   });
    // });
    
    // Nota: SauceDemo no consume esta API, esto es para practicar el patrón
  });

  test('2.2 Simular error 500 del servidor', async ({ page }) => {
    // TODO: Interceptar cualquier request a /api/*
    // TODO: Devolver un error 500 con mensaje JSON
    // TODO: El mensaje debe incluir: error, message, timestamp
    
    // await page.route('**/api/**', async (route) => {
    //   await route.fulfill({
    //     status: ???,
    //     contentType: 'application/json',
    //     body: JSON.stringify({
    //       error: 'Internal Server Error',
    //       message: ???,
    //       timestamp: new Date().toISOString()
    //     })
    //   });
    // });
  });

  test('2.3 Simular respuesta lenta', async ({ page }) => {
    // TODO: Interceptar requests a /api/slow
    // TODO: Agregar un delay de 3 segundos antes de responder
    // TODO: Devolver una respuesta exitosa después del delay
    
    // await page.route('**/api/slow', async (route) => {
    //   await new Promise(resolve => setTimeout(resolve, ???));
    //   await route.fulfill({ status: 200, body: '{"status": "ok"}' });
    // });
  });

});

test.describe('Ejercicio 3: Modificar Responses', () => {

  test('3.1 Interceptar y modificar respuesta de JSONPlaceholder', async ({ page }) => {
    // TODO: Interceptar GET a jsonplaceholder.typicode.com/users/1
    // TODO: Obtener la respuesta real con route.fetch()
    // TODO: Modificar el nombre a "Usuario Modificado por Test"
    // TODO: Modificar el email a "test@modified.com"
    // TODO: Devolver la respuesta modificada
    
    await page.route('https://jsonplaceholder.typicode.com/users/1', async (route) => {
      // const response = await route.fetch();
      // const json = await response.json();
      
      // Modificar datos
      // json.name = ???;
      // json.email = ???;
      
      // await route.fulfill({
      //   response,
      //   body: JSON.stringify(json)
      // });
    });
    
    // Para probar, hacemos un request desde la página
    const result = await page.evaluate(async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
      return res.json();
    });
    
    // expect(result.name).toBe('Usuario Modificado por Test');
    // expect(result.email).toBe('test@modified.com');
  });

});

test.describe('Ejercicio 4: Casos Prácticos', () => {

  test('4.1 Test con recursos bloqueados selectivamente', async ({ page }) => {
    // TODO: Bloquear:
    //   - Imágenes
    //   - Fuentes
    //   - Cualquier request que contenga "analytics" o "tracking"
    // TODO: Permitir: documentos, scripts, stylesheets
    // TODO: Navegar a SauceDemo y completar login
    // TODO: Verificar que funciona correctamente
    
    await page.route('**/*', async (route) => {
      const resourceType = route.request().resourceType();
      const url = route.request().url();
      
      // Bloquear imágenes
      // if (resourceType === 'image') {
      //   return route.abort();
      // }
      
      // Bloquear fuentes
      // if (resourceType === ???) { ... }
      
      // Bloquear analytics/tracking
      // if (url.includes('analytics') || url.includes('tracking')) { ... }
      
      // Permitir el resto
      await route.continue();
    });
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('4.2 Simular diferentes estados de inventario', async ({ page }) => {
    // ESCENARIO: Simular que la API devuelve inventario vacío
    
    // TODO: Interceptar /api/inventory
    // TODO: Devolver un array vacío []
    // TODO: En una app real, verificaríamos que se muestra "No hay productos"
    
    await page.route('**/api/inventory', async (route) => {
      // TODO: Completar el mock
    });
    
    // Este es un patrón conceptual - SauceDemo no usa esta API
  });

});

test.describe('Ejercicio 5: BONUS - Escenario Complejo', () => {

  test('5.1 Simular flujo de checkout con API mockeada', async ({ page }) => {
    // ESCENARIO AVANZADO:
    // Simular que el backend responde diferente en cada paso del checkout
    
    let checkoutStep = 0;
    
    await page.route('**/api/checkout/**', async (route) => {
      checkoutStep++;
      
      // TODO: Implementar respuestas diferentes según el paso:
      // Paso 1: Validación de carrito → { valid: true, items: [...] }
      // Paso 2: Validación de pago → { approved: true, transactionId: '...' }
      // Paso 3: Confirmación → { success: true, orderId: '...' }
      
      // switch(checkoutStep) {
      //   case 1:
      //     await route.fulfill({ ... });
      //     break;
      //   case 2:
      //     await route.fulfill({ ... });
      //     break;
      //   case 3:
      //     await route.fulfill({ ... });
      //     break;
      // }
    });
    
    // Nota: Este es un patrón avanzado para apps reales
  });

  test('5.2 Mock dinámico basado en request body', async ({ page }) => {
    // TODO: Interceptar POST a /api/search
    // TODO: Leer el body del request
    // TODO: Si busca "zapatos", devolver productos de zapatos
    // TODO: Si busca "camisas", devolver productos de camisas
    // TODO: Si busca otra cosa, devolver array vacío
    
    await page.route('**/api/search', async (route) => {
      const postData = route.request().postDataJSON();
      // const searchTerm = postData?.query || '';
      
      // let results = [];
      // if (searchTerm.includes('zapatos')) {
      //   results = [{ id: 1, name: 'Zapatos Nike', price: 99.99 }];
      // } else if (searchTerm.includes('camisas')) {
      //   results = [{ id: 2, name: 'Camisa Polo', price: 49.99 }];
      // }
      
      // await route.fulfill({
      //   status: 200,
      //   body: JSON.stringify({ results })
      // });
    });
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * 
 * ✅ Ejercicio 1: Intercepción básica funcionando
 * ✅ Ejercicio 2: Mocks devolviendo datos personalizados
 * ✅ Ejercicio 3: Modificación de responses en vuelo
 * ✅ Ejercicio 4: Bloqueo selectivo de recursos
 * ✅ BONUS: Mocks dinámicos basados en request
 */
