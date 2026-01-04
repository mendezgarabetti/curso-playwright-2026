// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 2: Interacción con Formularios
 * =====================================
 * Playwright ofrece métodos específicos para cada tipo de input.
 * Usar el método correcto hace el test más legible y robusto.
 */

test.describe('Inputs de Texto', () => {

  test('fill() vs type() - ¿Cuál usar?', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // fill(): REEMPLAZA todo el contenido del input
    // Es más rápido y es el método recomendado
    await page.locator('[data-test="username"]').fill('standard_user');
    
    // type(): Escribe caracter por caracter (simula tipeo humano)
    // Útil si necesitas probar eventos de teclado intermedios
    // await page.locator('[data-test="password"]').type('secret_sauce', { delay: 100 });
    
    // En la mayoría de casos, usa fill()
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    await expect(page.locator('[data-test="username"]')).toHaveValue('standard_user');
    await expect(page.locator('[data-test="password"]')).toHaveValue('secret_sauce');
  });

  test('clear() - Limpiar un input antes de escribir', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Llenar el campo
    await page.locator('[data-test="username"]').fill('usuario_incorrecto');
    
    // clear() borra el contenido
    await page.locator('[data-test="username"]').clear();
    
    // Verificar que está vacío
    await expect(page.locator('[data-test="username"]')).toBeEmpty();
    
    // Ahora llenar con el valor correcto
    await page.locator('[data-test="username"]').fill('standard_user');
  });

  test('pressSequentially() - Simular tipeo lento', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // pressSequentially simula escritura caracter por caracter
    // Útil para campos con autocompletado o validación en tiempo real
    await page.locator('[data-test="username"]').pressSequentially('standard_user', { delay: 50 });
    
    await expect(page.locator('[data-test="username"]')).toHaveValue('standard_user');
  });

});

test.describe('Formulario de Checkout - Ejemplo Completo', () => {

  test.beforeEach(async ({ page }) => {
    // Setup: Login y agregar producto al carrito
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
  });

  test('Llenar formulario completo', async ({ page }) => {
    // Verificar que estamos en checkout
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    
    // Llenar todos los campos
    await page.locator('[data-test="firstName"]').fill('Juan');
    await page.locator('[data-test="lastName"]').fill('Pérez');
    await page.locator('[data-test="postalCode"]').fill('5000');
    
    // Verificar valores
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Juan');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Pérez');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('5000');
    
    // Continuar
    await page.locator('[data-test="continue"]').click();
    
    // Verificar que avanzamos al resumen
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  });

  test('Validación de campos requeridos', async ({ page }) => {
    // Intentar continuar sin llenar nada
    await page.locator('[data-test="continue"]').click();
    
    // Debe mostrar error
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('First Name is required');
    
    // Llenar solo el nombre e intentar de nuevo
    await page.locator('[data-test="firstName"]').fill('Juan');
    await page.locator('[data-test="continue"]').click();
    
    // Ahora pide el apellido
    await expect(error).toContainText('Last Name is required');
    
    // Llenar apellido e intentar de nuevo
    await page.locator('[data-test="lastName"]').fill('Pérez');
    await page.locator('[data-test="continue"]').click();
    
    // Ahora pide el código postal
    await expect(error).toContainText('Postal Code is required');
  });

});

test.describe('Teclas Especiales y Combinaciones', () => {

  test('Presionar Enter para enviar formulario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // En lugar de hacer click en el botón, presionamos Enter
    await page.locator('[data-test="password"]').press('Enter');
    
    // Verificar que hizo login
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Tab para navegar entre campos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Focus en username
    await page.locator('[data-test="username"]').focus();
    await page.locator('[data-test="username"]').fill('standard_user');
    
    // Tab para ir al siguiente campo
    await page.keyboard.press('Tab');
    
    // Ahora el focus debería estar en password
    // Escribimos directamente
    await page.keyboard.type('secret_sauce');
    
    // Tab al botón y Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Control+A y Delete - Seleccionar todo y borrar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Llenar un campo
    await page.locator('[data-test="username"]').fill('texto_inicial');
    
    // Seleccionar todo con Control+A
    await page.locator('[data-test="username"]').press('Control+a');
    
    // Borrar con Delete o Backspace
    await page.locator('[data-test="username"]').press('Delete');
    
    // Verificar que está vacío
    await expect(page.locator('[data-test="username"]')).toBeEmpty();
    
    // Escribir nuevo texto
    await page.locator('[data-test="username"]').fill('standard_user');
  });

  test('Escape para cerrar elementos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Abrir menú hamburguesa
    await page.locator('#react-burger-menu-btn').click();
    
    // Verificar que el menú está abierto
    await expect(page.locator('.bm-menu-wrap')).toBeVisible();
    
    // Cerrar con Escape (puede no funcionar en todos los sitios)
    // await page.keyboard.press('Escape');
    
    // En SauceDemo, usamos el botón de cerrar
    await page.locator('#react-burger-cross-btn').click();
  });

});

test.describe('Dropdown (Select)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('selectOption() - Seleccionar por valor', async ({ page }) => {
    const dropdown = page.locator('[data-test="product-sort-container"]');
    
    // Ordenar de Z a A
    await dropdown.selectOption('za');
    
    // Verificar que el primer producto ahora es el último alfabéticamente
    const primerProducto = page.locator('[data-test="inventory-item-name"]').first();
    await expect(primerProducto).toContainText('Test.allTheThings');
  });

  test('selectOption() - Ordenar por precio', async ({ page }) => {
    const dropdown = page.locator('[data-test="product-sort-container"]');
    
    // Ordenar de menor a mayor precio
    await dropdown.selectOption('lohi');
    
    // Verificar que el primer producto es el más barato
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');
  });

  test('selectOption() - Múltiples formas de seleccionar', async ({ page }) => {
    const dropdown = page.locator('[data-test="product-sort-container"]');
    
    // Por valor del atributo value
    await dropdown.selectOption('hilo');
    
    // También se puede por:
    // - Label (texto visible): await dropdown.selectOption({ label: 'Price (high to low)' });
    // - Index: await dropdown.selectOption({ index: 3 });
    
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$49.99');
  });

});
