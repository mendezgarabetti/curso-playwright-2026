// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 1: Tests Frágiles vs Robustos
 * ===================================
 * Esta demo muestra POR QUÉ no automatizamos contra sitios
 * que no controlamos.
 * 
 * LECCIÓN: Wikipedia es un mal candidato para tests automatizados porque:
 * 1. No controlamos el contenido
 * 2. La estructura puede cambiar
 * 3. Los artículos pueden no existir en todos los idiomas
 * 4. El comportamiento de búsqueda varía
 * 
 * CONCLUSIÓN: Siempre usar aplicaciones de prueba controladas
 * (como SauceDemo, ReqRes, JSONPlaceholder, etc.)
 */

test.describe('❌ Ejemplo de Test FRÁGIL (Wikipedia)', () => {

  test.skip('Test frágil: Buscar en Wikipedia ES', async ({ page }) => {
    // ⚠️ Este test está marcado como skip porque FALLA frecuentemente
    // Lo dejamos como ejemplo educativo
    
    await page.goto('https://es.wikipedia.org/');
    
    // Verificar que cargó
    await expect(page).toHaveTitle(/Wikipedia/);
    
    // Buscar un término
    const barraBusqueda = page.getByPlaceholder('Buscar en Wikipedia').first();
    await barraBusqueda.fill('Playwright (software)');
    
    // Presionar Enter
    await page.keyboard.press('Enter');
    
    // ❌ PROBLEMA: Wikipedia ES no tiene artículo de Playwright
    // Esto lleva a una página de resultados, no al artículo
    // El siguiente selector puede no encontrar nada:
    await page.getByRole('link', { name: 'Playwright (software)' }).first().click();
    
    // Esta aserción probablemente falle
    await expect(page.locator('h1')).toContainText('Playwright');
  });

  test.skip('Intento de arreglo (sigue siendo frágil)', async ({ page }) => {
    // Incluso "arreglando" el test, sigue siendo frágil
    // porque dependemos de contenido externo
    
    await page.goto('https://es.wikipedia.org/');
    
    const barraBusqueda = page.getByPlaceholder('Buscar en Wikipedia').first();
    await barraBusqueda.fill('Playwright (software)');
    await page.keyboard.press('Enter');
    
    // "Arreglo": Esperar a que aparezcan resultados y hacer clic
    // Pero... ¿y si los resultados cambian? ¿Y si no hay resultados?
    await page.getByRole('link', { name: 'Playwright (software)' }).first().click();
    
    await expect(page.locator('h1')).toContainText('Playwright');
  });

});

test.describe('✅ Ejemplo de Test ROBUSTO (SauceDemo)', () => {

  test('Test robusto: Buscar producto en tienda controlada', async ({ page }) => {
    // SauceDemo es una aplicación de prueba:
    // - Contenido predecible y fijo
    // - Selectores data-test para QA
    // - No cambia sin aviso
    
    await page.goto('https://www.saucedemo.com/');
    
    // Login predecible
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Productos predecibles
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    
    // Producto específico siempre existe
    const backpack = page.locator('[data-test="item-4-title-link"]');
    await expect(backpack).toHaveText('Sauce Labs Backpack');
    
    // Click confiable
    await backpack.click();
    
    // Verificación confiable
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

});

test.describe('Comparación: Frágil vs Robusto', () => {

  /**
   * TABLA COMPARATIVA:
   * 
   * | Aspecto              | Wikipedia (Frágil)         | SauceDemo (Robusto)     |
   * |----------------------|----------------------------|-------------------------|
   * | Control del contenido| ❌ No                      | ✅ Sí                   |
   * | Selectores estables  | ❌ Pueden cambiar          | ✅ data-test            |
   * | Datos predecibles    | ❌ Cualquiera puede editar | ✅ Siempre iguales      |
   * | Disponibilidad       | ❌ Puede caer o cambiar    | ✅ Demo siempre online  |
   * | Idempotencia         | ❌ Resultados variables    | ✅ Mismo resultado      |
   */

  test('Demostración de idempotencia', async ({ page }) => {
    // Este test da el MISMO resultado cada vez que lo ejecutás
    // Eso se llama "idempotencia"
    
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Siempre hay 6 productos - PREDECIBLE
    const productos = page.locator('[data-test="inventory-item"]');
    await expect(productos).toHaveCount(6);
    
    // El primer producto siempre es Backpack - PREDECIBLE
    const primerNombre = page.locator('[data-test="inventory-item-name"]').first();
    await expect(primerNombre).toHaveText('Sauce Labs Backpack');
    
    // El precio siempre es $29.99 - PREDECIBLE
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$29.99');
  });

  test('Verificar todos los productos conocidos', async ({ page }) => {
    // Podemos verificar todos los productos porque SABEMOS cuáles son
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Lista completa de productos (conocida y estable)
    const productosEsperados = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];
    
    const nombres = page.locator('[data-test="inventory-item-name"]');
    
    for (let i = 0; i < productosEsperados.length; i++) {
      await expect(nombres.nth(i)).toHaveText(productosEsperados[i]);
    }
  });

});

test.describe('Lecciones Aprendidas', () => {

  test('✅ Siempre automatizar contra ambientes controlados', async ({ page }) => {
    /**
     * MEJORES PRÁCTICAS:
     * 
     * 1. Usar aplicaciones de prueba dedicadas:
     *    - SauceDemo (e-commerce)
     *    - ReqRes.in (API)
     *    - JSONPlaceholder (API)
     *    - The Internet (Heroku)
     * 
     * 2. Si es una app real, usar:
     *    - Ambiente de QA dedicado
     *    - Datos de prueba controlados
     *    - Mocks cuando sea necesario
     * 
     * 3. Nunca automatizar contra:
     *    - Producción con datos reales
     *    - Sitios de terceros que no controlamos
     *    - Contenido que cambia frecuentemente
     */
    
    // Este test pasa porque SauceDemo es predecible
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

});
