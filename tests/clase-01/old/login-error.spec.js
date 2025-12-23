// @ts-check
const { test, expect } = require('@playwright/test');

test('Debe mostrar error al ingresar usuario bloqueado', async ({ page }) => {
  // 1. Ir a la tienda
  await page.goto('https://www.saucedemo.com/');

  // 2. Ingresar credenciales del usuario que sabemos que fallará
  // Usuario: locked_out_user
  // Pass: secret_sauce
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');

  // 3. Hacer clic en Login
  await page.locator('[data-test="login-button"]').click();

  // 4. VALIDACIÓN DEL ERROR
  // Primero localizamos la caja roja del error. 
  // SauceDemo es amable y le puso un data-test="error".
  const mensajeError = page.locator('[data-test="error"]');

  // Aserción 1: ¿El mensaje apareció? (Es visible)
  await expect(mensajeError).toBeVisible();

  // Aserción 2: ¿Dice lo que tiene que decir?
  // Verificamos el texto exacto.
  await expect(mensajeError).toContainText('Epic sadface: Sorry, this user has been locked out.');
});