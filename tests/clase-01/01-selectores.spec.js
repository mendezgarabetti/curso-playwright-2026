// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 1: Selectores Básicos
 * ===========================
 * Playwright ofrece múltiples formas de seleccionar elementos.
 * Esta demo muestra las opciones desde las más recomendadas
 * hasta las menos robustas.
 * 
 * JERARQUÍA DE SELECTORES (de mejor a peor):
 * 
 * 🥇 NIVEL 1 - Atributos de Testing
 *    data-test, data-testid, data-cy
 *    → Los desarrolladores los ponen específicamente para QA
 * 
 * 🥈 NIVEL 2 - Semánticos (getByRole, getByLabel)
 *    Basados en accesibilidad y significado
 *    → Resilientes a cambios de estilo
 * 
 * 🥉 NIVEL 3 - Por Contenido (getByText, getByPlaceholder)
 *    Basados en el texto visible
 *    → Frágiles si cambia el idioma o el texto
 * 
 * 💀 NIVEL 4 - Estructurales (CSS, XPath)
 *    Basados en la estructura del HTML
 *    → MUY frágiles, evitar si es posible
 */

test.describe('Jerarquía de Selectores', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 🥇 NIVEL 1: Atributos de Testing (MEJOR OPCIÓN)
  // ═══════════════════════════════════════════════════════════════════════════

  test('NIVEL 1: Selectores data-test (recomendado)', async ({ page }) => {
    // SauceDemo usa data-test para TODOS sus elementos importantes
    // Esto es lo ideal - los desarrolladores colaboran con QA
    
    const username = page.locator('[data-test="username"]');
    const password = page.locator('[data-test="password"]');
    const loginBtn = page.locator('[data-test="login-button"]');
    
    await username.fill('standard_user');
    await password.fill('secret_sauce');
    await loginBtn.click();
    
    // Verificar con otro selector data-test
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 🥈 NIVEL 2: Selectores Semánticos (Basados en Accesibilidad)
  // ═══════════════════════════════════════════════════════════════════════════

  test('NIVEL 2: getByRole (basado en accesibilidad)', async ({ page }) => {
    // getByRole busca por el rol ARIA del elemento
    // Más resiliente que buscar por clase o estructura
    
    // Buscar el botón de login por su rol
    const loginBtn = page.getByRole('button', { name: 'Login' });
    
    // Buscar inputs por su rol (aunque no es lo ideal para inputs)
    const inputs = page.getByRole('textbox');
    
    // Llenar y hacer login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await loginBtn.click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('NIVEL 2: getByLabel (asociado a label)', async ({ page }) => {
    // Nota: SauceDemo no usa labels tradicionales
    // Este ejemplo es conceptual
    
    // En una app con labels apropiados:
    // const email = page.getByLabel('Email');
    // const password = page.getByLabel('Contraseña');
    
    // Para SauceDemo, usamos data-test
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 🥉 NIVEL 3: Selectores por Contenido
  // ═══════════════════════════════════════════════════════════════════════════

  test('NIVEL 3: getByPlaceholder', async ({ page }) => {
    // Busca elementos por su atributo placeholder
    // Útil pero frágil si cambia el texto
    
    const username = page.getByPlaceholder('Username');
    const password = page.getByPlaceholder('Password');
    
    await username.fill('standard_user');
    await password.fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('NIVEL 3: getByText', async ({ page }) => {
    // Busca elementos por su texto visible
    // MUY común pero frágil si cambia el idioma
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Buscar producto por su nombre
    const backpack = page.getByText('Sauce Labs Backpack');
    await expect(backpack).toBeVisible();
    
    // También funciona con texto parcial (regex)
    const fleece = page.getByText(/Fleece Jacket/);
    await expect(fleece).toBeVisible();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 💀 NIVEL 4: Selectores Estructurales (EVITAR)
  // ═══════════════════════════════════════════════════════════════════════════

  test('NIVEL 4: CSS Selectors (frágil)', async ({ page }) => {
    // Los selectores CSS son poderosos pero frágiles
    // Un cambio en la estructura HTML los rompe
    
    // ❌ MAL: Selector por clase (puede cambiar)
    // await page.locator('.login_wrapper-inner').click();
    
    // ❌ MAL: Selector por estructura (MUY frágil)
    // await page.locator('form > div:nth-child(1) > input').fill('user');
    
    // ✅ Mejor usar data-test
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('NIVEL 4: XPath (evitar)', async ({ page }) => {
    // XPath es muy potente pero muy frágil
    // Solo usar como último recurso
    
    // ❌ EVITAR: XPath por estructura
    // await page.locator('//div[@class="login_wrapper"]//input[1]').fill('user');
    
    // Si NECESITÁS XPath, al menos usá atributos
    // await page.locator('//input[@data-test="username"]').fill('user');
    
    // ✅ Mejor usar el locator normal
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

});

test.describe('Combinaciones Útiles', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Filtrar con .filter()', async ({ page }) => {
    // Útil cuando hay múltiples elementos similares
    const productos = page.locator('[data-test="inventory-item"]');
    
    // Filtrar por contenido
    const backpack = productos.filter({ hasText: 'Backpack' });
    await expect(backpack).toHaveCount(1);
  });

  test('Encadenar selectores', async ({ page }) => {
    // Buscar dentro de un contenedor
    const primerProducto = page.locator('[data-test="inventory-item"]').first();
    
    // Buscar el botón DENTRO del primer producto
    const addButton = primerProducto.locator('button');
    await addButton.click();
    
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Usar .first(), .last(), .nth()', async ({ page }) => {
    const productos = page.locator('[data-test="inventory-item"]');
    
    // Primer producto
    const primero = productos.first();
    await expect(primero).toBeVisible();
    
    // Último producto
    const ultimo = productos.last();
    await expect(ultimo).toBeVisible();
    
    // Tercer producto (índice 2)
    const tercero = productos.nth(2);
    await expect(tercero).toBeVisible();
  });

});
