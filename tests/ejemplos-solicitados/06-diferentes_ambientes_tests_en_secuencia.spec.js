import { test, expect } from '@playwright/test';

test.describe('Demo: Uso de environments', () => {

  test('Abrir página según entorno', async ({ page }) => {
    await page.goto('/');

    console.log('🌐 URL actual:', page.url());
    console.log('🌎 Entorno:', process.env.ENV_NAME);

    await expect(page).toHaveURL(/http/);
  });

  test('Validación básica visual', async ({ page }) => {
    await page.goto('/');

    // Validación genérica para ambas páginas
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });
});