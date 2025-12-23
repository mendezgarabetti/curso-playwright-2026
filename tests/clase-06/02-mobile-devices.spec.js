// @ts-check
const { test, expect, devices } = require('@playwright/test');

/**
 * CLASE 6: Emulación de Dispositivos Móviles
 * ==========================================
 * Playwright puede emular dispositivos móviles con:
 * - Viewport específico
 * - User Agent móvil
 * - Touch events
 * - Device scale factor
 * 
 * Lista completa de dispositivos:
 * https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json
 */

// ═══════════════════════════════════════════════════════════════════════════
// OPCIÓN 1: Usar devices predefinidos con test.use()
// ═══════════════════════════════════════════════════════════════════════════

test.describe('iPhone 12', () => {
  test.use({ ...devices['iPhone 12'] });

  test('Login en iPhone 12', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // El viewport ya es el de iPhone 12
    const viewport = page.viewportSize();
    console.log(`📱 Viewport: ${viewport.width}x${viewport.height}`);
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Navegación táctil en iPhone', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Scroll como en móvil
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Tap en producto
    await page.locator('[data-test="item-4-title-link"]').tap();
    
    await expect(page).toHaveURL(/.*inventory-item.html/);
  });
});

test.describe('Pixel 5 (Android)', () => {
  test.use({ ...devices['Pixel 5'] });

  test('Login en Pixel 5', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    const viewport = page.viewportSize();
    console.log(`📱 Viewport Pixel 5: ${viewport.width}x${viewport.height}`);
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});

test.describe('iPad Pro', () => {
  test.use({ ...devices['iPad Pro 11'] });

  test('Vista tablet en iPad Pro', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    const viewport = page.viewportSize();
    console.log(`📱 Viewport iPad: ${viewport.width}x${viewport.height}`);
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // En tablet, verificar que se muestra la vista completa
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// OPCIÓN 2: Configuración personalizada de viewport
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Viewport Personalizado', () => {
  test.use({
    viewport: { width: 375, height: 667 },  // iPhone SE
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
  });

  test('Test con viewport personalizado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    const viewport = page.viewportSize();
    console.log(`📱 Viewport custom: ${viewport.width}x${viewport.height}`);
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// OPCIÓN 3: Landscape vs Portrait
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Orientación del dispositivo', () => {

  test.describe('iPhone Portrait', () => {
    test.use({ ...devices['iPhone 12'] });

    test('Vista vertical', async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
      const viewport = page.viewportSize();
      console.log(`📱 Portrait: ${viewport.width}x${viewport.height}`);
      
      // En portrait, width < height
      expect(viewport.width).toBeLessThan(viewport.height);
    });
  });

  test.describe('iPhone Landscape', () => {
    test.use({ ...devices['iPhone 12 landscape'] });

    test('Vista horizontal', async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
      const viewport = page.viewportSize();
      console.log(`📱 Landscape: ${viewport.width}x${viewport.height}`);
      
      // En landscape, width > height
      expect(viewport.width).toBeGreaterThan(viewport.height);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Tests de Responsive Design
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Responsive Design', () => {

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Desktop HD', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    test(`Login en ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      
      await expect(page).toHaveURL(/.*inventory.html/);
      
      // Screenshot para comparar
      await page.screenshot({ 
        path: `test-results/responsive/${vp.name.toLowerCase()}.png`,
        fullPage: true 
      });
    });
  }

});

// ═══════════════════════════════════════════════════════════════════════════
// Lista de dispositivos disponibles
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Referencia: Dispositivos disponibles', () => {

  test.skip('Lista de dispositivos (solo referencia)', async () => {
    /**
     * DISPOSITIVOS MÓVILES COMUNES:
     * 
     * iPhone:
     * - 'iPhone 12'
     * - 'iPhone 12 Pro'
     * - 'iPhone 12 Pro Max'
     * - 'iPhone 13'
     * - 'iPhone 13 Pro'
     * - 'iPhone 13 Pro Max'
     * - 'iPhone SE'
     * 
     * Android:
     * - 'Pixel 5'
     * - 'Pixel 7'
     * - 'Galaxy S8'
     * - 'Galaxy S9+'
     * - 'Galaxy Tab S4'
     * 
     * Tablets:
     * - 'iPad'
     * - 'iPad Mini'
     * - 'iPad Pro 11'
     * 
     * Agregar 'landscape' para orientación horizontal:
     * - 'iPhone 12 landscape'
     * - 'iPad Pro 11 landscape'
     */
  });

});
