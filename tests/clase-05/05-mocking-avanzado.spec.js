// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 5: Mocking Avanzado - Casos de Uso Reales
 * ===============================================
 * Escenarios prácticos donde el mocking es indispensable.
 */

test.describe('Caso 1: Simular Estados de Error', () => {

  test('Simular error 500 y verificar mensaje de error en UI', async ({ page }) => {
    // Interceptar cualquier request de API y devolver error
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'El servidor no está disponible temporalmente'
        })
      });
    });
    
    // En una app real, verificaríamos el mensaje de error
    // await page.goto('/dashboard');
    // await expect(page.locator('.error-message')).toContainText('servidor no está disponible');
    
    // Demo con SauceDemo (no usa APIs reales)
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Simular timeout de red', async ({ page }) => {
    await page.route('**/api/slow-endpoint', async (route) => {
      // No responder - simula timeout
      // El test esperará hasta el timeout configurado
    });
    
    // await page.goto('/page-with-slow-api');
    // await expect(page.locator('.loading-timeout-message')).toBeVisible();
  });

  test('Simular error de autenticación (401)', async ({ page }) => {
    await page.route('**/api/protected/**', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Su sesión ha expirado'
        })
      });
    });
    
    // La app debería redirigir al login
    // await page.goto('/protected/dashboard');
    // await expect(page).toHaveURL('/login');
    // await expect(page.locator('.session-expired')).toBeVisible();
  });

  test('Simular error de validación (400)', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Validation Error',
            fields: {
              email: 'El email ya está registrado',
              password: 'La contraseña debe tener al menos 8 caracteres'
            }
          })
        });
      } else {
        await route.continue();
      }
    });
    
    // await page.goto('/register');
    // await page.fill('#email', 'existing@email.com');
    // await page.fill('#password', 'short');
    // await page.click('button[type="submit"]');
    // await expect(page.locator('.field-error.email')).toContainText('ya está registrado');
  });

});

test.describe('Caso 2: Simular Datos Específicos', () => {

  test('Usuario con carrito vacío', async ({ page }) => {
    await page.route('**/api/cart', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          total: 0
        })
      });
    });
    
    // await page.goto('/cart');
    // await expect(page.locator('.empty-cart-message')).toBeVisible();
  });

  test('Usuario con carrito lleno (muchos productos)', async ({ page }) => {
    const manyItems = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Producto ${i + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: (Math.random() * 100).toFixed(2)
    }));
    
    await page.route('**/api/cart', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: manyItems,
          total: manyItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        })
      });
    });
    
    // Verificar que la UI maneja bien muchos productos
    // await page.goto('/cart');
    // await expect(page.locator('.cart-items')).toHaveCount(50);
  });

  test('Productos sin stock', async ({ page }) => {
    await page.route('**/api/products/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Producto Agotado',
          price: 29.99,
          stock: 0,
          available: false
        })
      });
    });
    
    // await page.goto('/products/1');
    // await expect(page.locator('.out-of-stock-badge')).toBeVisible();
    // await expect(page.locator('.add-to-cart-button')).toBeDisabled();
  });

  test('Precios en diferentes monedas', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      const url = new URL(route.request().url());
      const currency = url.searchParams.get('currency') || 'USD';
      
      const exchangeRates = { USD: 1, EUR: 0.85, ARS: 850 };
      const basePrice = 100;
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 1,
          name: 'Producto',
          price: basePrice * exchangeRates[currency],
          currency: currency
        }])
      });
    });
    
    // await page.goto('/products?currency=ARS');
    // await expect(page.locator('.price')).toContainText('$85,000');
  });

});

test.describe('Caso 3: Simular Comportamientos de Red', () => {

  test('Conexión lenta (throttling)', async ({ page }) => {
    await page.route('**/*', async (route) => {
      // Agregar delay de 2 segundos a cada request
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    // La página cargará lentamente
    // Útil para probar indicadores de carga
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Simular desconexión', async ({ page }) => {
    let isOnline = true;
    
    await page.route('**/*', async (route) => {
      if (isOnline) {
        await route.continue();
      } else {
        await route.abort('internetdisconnected');
      }
    });
    
    await page.goto('https://www.saucedemo.com/');
    
    // Simular desconexión
    isOnline = false;
    
    // Los siguientes requests fallarán
    // await page.click('.refresh-button');
    // await expect(page.locator('.offline-message')).toBeVisible();
  });

  test('Simular respuestas condicionales', async ({ page }) => {
    let requestCount = 0;
    
    await page.route('**/api/data', async (route) => {
      requestCount++;
      
      if (requestCount === 1) {
        // Primera vez: éxito
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ data: 'success' })
        });
      } else if (requestCount === 2) {
        // Segunda vez: error
        await route.fulfill({ status: 500 });
      } else {
        // Tercera vez: éxito de nuevo
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ data: 'recovered' })
        });
      }
    });
    
    // Útil para probar lógica de reintentos
  });

});

test.describe('Caso 4: Feature Flags y A/B Testing', () => {

  test('Simular feature flag activada', async ({ page }) => {
    await page.route('**/api/feature-flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          newCheckout: true,
          darkMode: true,
          betaFeatures: true
        })
      });
    });
    
    // await page.goto('/');
    // await expect(page.locator('.new-checkout-banner')).toBeVisible();
  });

  test('Simular variante de A/B test', async ({ page }) => {
    await page.route('**/api/ab-test/checkout-button', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          variant: 'B',
          buttonText: 'Comprar Ahora',
          buttonColor: '#FF5722'
        })
      });
    });
    
    // await page.goto('/cart');
    // await expect(page.locator('.checkout-button')).toHaveText('Comprar Ahora');
  });

});

test.describe('Caso 5: Datos Sensibles al Tiempo', () => {

  test('Simular promoción vigente', async ({ page }) => {
    await page.route('**/api/promotions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          active: true,
          name: 'Black Friday',
          discount: 50,
          endsAt: new Date(Date.now() + 3600000).toISOString() // 1 hora
        })
      });
    });
    
    // await page.goto('/');
    // await expect(page.locator('.promo-banner')).toBeVisible();
    // await expect(page.locator('.discount')).toContainText('50%');
  });

  test('Simular promoción expirada', async ({ page }) => {
    await page.route('**/api/promotions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          active: false,
          name: 'Black Friday',
          discount: 50,
          endsAt: new Date(Date.now() - 3600000).toISOString() // Hace 1 hora
        })
      });
    });
    
    // await page.goto('/');
    // await expect(page.locator('.promo-banner')).not.toBeVisible();
  });

});
