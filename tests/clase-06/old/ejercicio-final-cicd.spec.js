// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO FINAL: Suite de Tests para CI/CD                           ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Esta suite simula un conjunto de tests listos para CI/CD.            ║
 * ║                                                                       ║
 * ║  Objetivos:                                                           ║
 * ║  1. Ejecutar en múltiples navegadores                                 ║
 * ║  2. Generar reportes HTML y JUnit                                     ║
 * ║  3. Tomar screenshots en caso de fallo                                ║
 * ║  4. Usar test.step() para mejor trazabilidad                          ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('Smoke Tests', () => {
  // Tests rápidos que validan funcionalidad crítica
  // Deben ejecutarse en cada commit

  test('SMOKE-001: Página de login carga correctamente', async ({ page }) => {
    await test.step('Navegar a la página', async () => {
      await page.goto('https://www.saucedemo.com/');
    });

    await test.step('Verificar elementos del formulario', async () => {
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    await test.step('Verificar logo', async () => {
      await expect(page.locator('.login_logo')).toBeVisible();
    });
  });

  test('SMOKE-002: Login exitoso', async ({ page }) => {
    await test.step('Navegar al login', async () => {
      await page.goto('https://www.saucedemo.com/');
    });

    await test.step('Ingresar credenciales', async () => {
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
    });

    await test.step('Hacer click en login', async () => {
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('Verificar redirección', async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });
  });

  test('SMOKE-003: Productos se muestran', async ({ page }) => {
    await test.step('Login', async () => {
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('Verificar productos', async () => {
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    });
  });

});

test.describe('Regression Tests', () => {
  // Tests más completos que cubren flujos de negocio

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('REG-001: Agregar producto al carrito', async ({ page }) => {
    await test.step('Agregar producto', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    });

    await test.step('Verificar badge del carrito', async () => {
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    });

    await test.step('Verificar botón cambió a Remove', async () => {
      await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    });
  });

  test('REG-002: Ordenar productos por precio', async ({ page }) => {
    await test.step('Seleccionar orden bajo a alto', async () => {
      await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    });

    await test.step('Verificar primer producto es el más barato', async () => {
      const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
      await expect(firstPrice).toHaveText('$7.99');
    });
  });

  test('REG-003: Remover producto del carrito', async ({ page }) => {
    await test.step('Agregar producto', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    });

    await test.step('Remover producto', async () => {
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    });

    await test.step('Verificar carrito vacío', async () => {
      await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });
  });

  test('REG-004: Ver detalle de producto', async ({ page }) => {
    await test.step('Click en nombre de producto', async () => {
      await page.locator('[data-test="item-4-title-link"]').click();
    });

    await test.step('Verificar página de detalle', async () => {
      await expect(page).toHaveURL(/.*inventory-item.html/);
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
      await expect(page.locator('[data-test="inventory-item-name"]')).toBeVisible();
    });
  });

});

test.describe('E2E: Flujo Completo de Compra', () => {
  // Test end-to-end del Happy Path

  test('E2E-001: Compra completa', async ({ page }) => {
    // Agregar anotaciones para el reporte
    test.info().annotations.push({ type: 'type', description: 'E2E' });
    test.info().annotations.push({ type: 'priority', description: 'critical' });

    await test.step('1. Login', async () => {
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    await test.step('2. Agregar productos', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    });

    await test.step('3. Ir al carrito', async () => {
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    });

    await test.step('4. Iniciar checkout', async () => {
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    await test.step('5. Llenar información', async () => {
      await page.locator('[data-test="firstName"]').fill('Test');
      await page.locator('[data-test="lastName"]').fill('User');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();
    });

    await test.step('6. Verificar resumen', async () => {
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    });

    await test.step('7. Finalizar compra', async () => {
      await page.locator('[data-test="finish"]').click();
      await expect(page).toHaveURL(/.*checkout-complete.html/);
    });

    await test.step('8. Verificar confirmación', async () => {
      await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
      
      // Screenshot de éxito para el reporte
      const screenshot = await page.screenshot();
      await test.info().attach('orden-completada', {
        body: screenshot,
        contentType: 'image/png'
      });
    });
  });

});

test.describe('Negative Tests', () => {
  // Tests de casos de error

  test('NEG-001: Login con usuario bloqueado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('NEG-002: Login sin credenciales', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('NEG-003: Checkout sin información', async ({ page }) => {
    // Setup
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Intentar continuar sin datos
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

});

/**
 * INSTRUCCIONES PARA EJECUTAR:
 * 
 * 1. Todos los navegadores:
 *    npx playwright test ejercicio-final-cicd.spec.js
 * 
 * 2. Solo Chromium:
 *    npx playwright test ejercicio-final-cicd.spec.js --project=chromium
 * 
 * 3. Con reporte:
 *    npx playwright test ejercicio-final-cicd.spec.js
 *    npx playwright show-report
 * 
 * 4. Solo smoke tests:
 *    npx playwright test --grep "SMOKE"
 * 
 * 5. Solo E2E:
 *    npx playwright test --grep "E2E"
 */
