// @ts-check
const { test, expect } = require('@playwright/test');

test('Flujo de compra completo (E2E)', async ({ page }) => {
  // 1. Login (Paso previo necesario)
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // 2. Agregar la camiseta "Sauce Labs Bolt T-Shirt"
  // Usamos el selector específico para ese producto
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

  // 3. Ir al Carrito
  // NOTA: Este elemento no suele tener data-test, usamos la clase CSS
  await page.locator('.shopping_cart_link').click();

  // 4. Validar que estamos en el carrito y dar click en Checkout
  await expect(page).toHaveURL(/.*cart.html/);
  await page.locator('[data-test="checkout"]').click();

  // 5. Llenar formulario de envío (Checkout: Your Information)
  await page.locator('[data-test="firstName"]').fill('Estudiante');
  await page.locator('[data-test="lastName"]').fill('QA');
  await page.locator('[data-test="postalCode"]').fill('12345');
  
  // 6. Ir al resumen (Botón Continue)
  await page.locator('[data-test="continue"]').click();

  // 7. Finalizar compra (Botón Finish)
  // Aquí podríamos validar que el total es correcto, pero por ahora solo finalizamos
  await page.locator('[data-test="finish"]').click();

  // 8. Validación Final (La Gran Aserción)
  const mensajeFinal = page.locator('[data-test="complete-header"]');
  
  // Verificamos que sea visible
  await expect(mensajeFinal).toBeVisible();
  
  // Verificamos el texto exacto de éxito
  await expect(mensajeFinal).toHaveText('Thank you for your order!');
});