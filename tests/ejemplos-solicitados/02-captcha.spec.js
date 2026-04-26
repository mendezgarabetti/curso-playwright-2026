import { test } from '@playwright/test';

test('demo captcha (no automatizable)', async ({ page }) => {
  await page.goto('https://www.google.com/recaptcha/api2/demo');

  // 🔴 Pausa inicial
  await page.pause();

  // Cambiar al iframe del captcha
  const frame = page.frameLocator('iframe[title="reCAPTCHA"]');

  // Intentar click en el checkbox
  await frame.locator('#recaptcha-anchor').click();

  // 🔴 Pausa para mostrar resultado
  await page.pause();
});