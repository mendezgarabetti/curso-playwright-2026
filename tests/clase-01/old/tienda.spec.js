// @ts-check
const { test, expect } = require('@playwright/test');

test('Compra básica en Swag Labs', async ({ page }) => {
  // 1. Ir a la tienda
  await page.goto('https://www.saucedemo.com/');
    await page.pause(1000); // Pausa para ver el cambio en el carrito


  // 2. Llenar el Login
  // Fíjate que usamos 'data-test'. ¡Esto es el Nivel 3 de calidad que hablamos!
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');

  // 3. Hacer clic en Login
  await page.locator('[data-test="login-button"]').click();

  // 4. Validar que estamos dentro
  // Verificamos que aparezca el título "Products" o la URL cambie
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  
  // 5. (Bonus) Agregar una mochila al carrito
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  
  // Validar que el carrito tiene un '1'
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
});