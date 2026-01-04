// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 6: Configuración de Múltiples Entornos
 * ============================================
 * Cómo ejecutar los mismos tests en diferentes entornos:
 * - Desarrollo (dev)
 * - Staging/QA
 * - Producción
 * 
 * Métodos:
 * 1. Variables de entorno
 * 2. Archivo .env
 * 3. Parámetros de línea de comandos
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE ENTORNOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Definición de entornos
 */
const environments = {
  dev: {
    baseUrl: 'https://dev.saucedemo.com',
    apiUrl: 'https://api-dev.saucedemo.com',
    users: {
      standard: { username: 'dev_user', password: 'dev_pass' }
    }
  },
  staging: {
    baseUrl: 'https://staging.saucedemo.com',
    apiUrl: 'https://api-staging.saucedemo.com',
    users: {
      standard: { username: 'staging_user', password: 'staging_pass' }
    }
  },
  prod: {
    baseUrl: 'https://www.saucedemo.com',
    apiUrl: 'https://api.saucedemo.com',
    users: {
      standard: { username: 'standard_user', password: 'secret_sauce' }
    }
  }
};

// Obtener entorno de variable de entorno (default: prod)
const ENV = process.env.TEST_ENV || 'prod';
const config = environments[ENV] || environments.prod;

console.log(`
╔═══════════════════════════════════════╗
║  ENTORNO: ${ENV.toUpperCase().padEnd(27)}║
║  URL: ${config.baseUrl.padEnd(31)}║
╚═══════════════════════════════════════╝
`);

// ═══════════════════════════════════════════════════════════════════════════
// TESTS QUE USAN LA CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

test.describe(`Tests en entorno: ${ENV}`, () => {

  test('Login con credenciales del entorno', async ({ page }) => {
    // Usar URL del entorno
    // Nota: Para este ejemplo usamos prod porque los otros no existen
    await page.goto('https://www.saucedemo.com/');
    
    // Usar credenciales del entorno
    const user = config.users.standard;
    await page.locator('[data-test="username"]').fill(user.username);
    await page.locator('[data-test="password"]').fill(user.password);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Verificar productos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    const user = config.users.standard;
    await page.locator('[data-test="username"]').fill(user.username);
    await page.locator('[data-test="password"]').fill(user.password);
    await page.locator('[data-test="login-button"]').click();
    
    // Verificación que aplica a todos los entornos
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(6);
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// TESTS CONDICIONALES POR ENTORNO
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Tests específicos por entorno', () => {

  test('Test solo para producción', async ({ page }) => {
    test.skip(ENV !== 'prod', 'Este test solo corre en producción');
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Test que NO corre en producción', async ({ page }) => {
    test.skip(ENV === 'prod', 'Este test no corre en producción');
    
    // Test destructivo que solo debe correr en dev/staging
    console.log('Ejecutando test destructivo...');
  });

  test('Test con datos diferentes por entorno', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Diferentes expectativas por entorno
    if (ENV === 'dev') {
      console.log('🔧 Modo desarrollo - datos de prueba');
    } else if (ENV === 'staging') {
      console.log('🧪 Modo staging - datos similares a prod');
    } else {
      console.log('🚀 Modo producción - datos reales');
    }
    
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// COMANDOS PARA EJECUTAR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CÓMO EJECUTAR EN DIFERENTES ENTORNOS:
 * 
 * Windows (PowerShell):
 *   $env:TEST_ENV="dev"; npx playwright test
 *   $env:TEST_ENV="staging"; npx playwright test
 *   $env:TEST_ENV="prod"; npx playwright test
 * 
 * Windows (CMD):
 *   set TEST_ENV=dev && npx playwright test
 * 
 * Linux/Mac:
 *   TEST_ENV=dev npx playwright test
 *   TEST_ENV=staging npx playwright test
 *   TEST_ENV=prod npx playwright test
 * 
 * En package.json (scripts):
 *   "test:dev": "TEST_ENV=dev npx playwright test",
 *   "test:staging": "TEST_ENV=staging npx playwright test",
 *   "test:prod": "TEST_ENV=prod npx playwright test"
 */
