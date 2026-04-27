import { test, expect } from '@playwright/test';

test('Verificar que el entorno responde', async ({ page }) => {
  console.log('URL guardada en config', process.env.BASE_URL);
  await page.goto('https://orion.sefin.gob.hn/teso/teso-ben-prb-app/');

  console.log('🌐 URL actual:', page.url());

  // Validación simple
  await expect(page).toHaveURL(/.*orion.sefin.gob.hn.*/);
  // Validación que rompe el setup
  //await expect(page).toHaveURL(/algo-incorrecto/);


  // En un ejemplo real podrian realizarse más validaciones para validar
  // que el login es correcto, ya que serian similares los sitios web.
});