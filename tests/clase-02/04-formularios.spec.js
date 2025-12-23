// @ts-check
const { test, expect } = require('@playwright/test');

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

  test('pressSequentially() - Simular tipeo lento (antes era type())', async ({ page }) => {
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

  test('Combinaciones de teclas (Ctrl+A, etc)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Llenar con texto
    await page.locator('[data-test="username"]').fill('texto_a_seleccionar');
    
    // Seleccionar todo (Ctrl+A) y reemplazar
    await page.locator('[data-test="username"]').press('Control+a');
    await page.locator('[data-test="username"]').press('Backspace');
    
    // Verificar que está vacío
    await expect(page.locator('[data-test="username"]')).toBeEmpty();
    
    // Ahora escribir el valor correcto
    await page.locator('[data-test="username"]').fill('standard_user');
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
    
    // Seleccionar por el atributo "value" de la opción
    await dropdown.selectOption('lohi'); // Precio: bajo a alto
    
    // Verificar que se aplicó el filtro
    await expect(dropdown).toHaveValue('lohi');
    
    // El primer producto debería ser el más barato
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$7.99');
  });

  test('selectOption() - Seleccionar por texto visible', async ({ page }) => {
    const dropdown = page.locator('[data-test="product-sort-container"]');
    
    // Seleccionar por el texto que ve el usuario
    await dropdown.selectOption({ label: 'Price (high to low)' });
    
    // Verificar que se aplicó
    await expect(dropdown).toHaveValue('hilo');
    
    // El primer producto debería ser el más caro
    const primerPrecio = page.locator('[data-test="inventory-item-price"]').first();
    await expect(primerPrecio).toHaveText('$49.99');
  });

  test('selectOption() - Seleccionar por índice', async ({ page }) => {
    const dropdown = page.locator('[data-test="product-sort-container"]');
    
    // Seleccionar la tercera opción (índice 2)
    await dropdown.selectOption({ index: 2 });
    
    // Verificar (índice 2 es "Price low to high")
    await expect(dropdown).toHaveValue('lohi');
  });

  test('Verificar todas las opciones disponibles', async ({ page }) => {
    const dropdown = page.locator('[data-test="product-sort-container"]');
    
    // Obtener todas las opciones
    const opciones = dropdown.locator('option');
    
    // Deberían haber 4 opciones de ordenamiento
    await expect(opciones).toHaveCount(4);
    
    // Verificar los textos
    await expect(opciones.nth(0)).toHaveText('Name (A to Z)');
    await expect(opciones.nth(1)).toHaveText('Name (Z to A)');
    await expect(opciones.nth(2)).toHaveText('Price (low to high)');
    await expect(opciones.nth(3)).toHaveText('Price (high to low)');
  });

});
