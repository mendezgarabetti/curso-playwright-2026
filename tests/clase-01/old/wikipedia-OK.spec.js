// @ts-check
const { test, expect } = require('@playwright/test');

test('Buscar Playwright en Wikipedia', async ({ page }) => {
  // 1. Ir a la home
  await page.goto('https://es.wikipedia.org/');

  // 2. Verificar carga
  await expect(page).toHaveTitle(/Wikipedia/);

  // 3. Buscar
  const barraBusqueda = page.getByPlaceholder('Buscar en Wikipedia').first();
  await barraBusqueda.fill('Playwright (software)');

  // 4. Presionar Enter
  await page.keyboard.press('Enter');

  // --- NUEVO PASO (EL ARREGLO) ---
  // 4.5. Estamos en la lista de resultados. Hacemos clic en el enlace correcto.
  // Usamos .first() por si el enlace aparece repetido en el menú o pie de página.
  await page.getByRole('link', { name: 'Playwright (software)' }).first().click();

  // 5. Validar
  // Ahora sí, esperamos ver el artículo final
  await expect(page.locator('h1')).toContainText('Playwright');
});