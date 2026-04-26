import { test, expect } from '@playwright/test';

test('Verificar que el entorno responde', async ({ page }) => {
  await page.goto('/');

  console.log('🌐 URL actual:', page.url());
  console.log('🌎 Entorno:', process.env.ENV_NAME);

  // Validación simple
  await expect(page).toHaveURL(/http/);
  // Validación que rompe el setup
  //await expect(page).toHaveURL(/algo-incorrecto/);


  // En un ejemplo real podrian realizarse más validaciones para validar
  // que el login es correcto, ya que serian similares los sitios web.
});