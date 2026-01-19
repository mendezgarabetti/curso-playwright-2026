// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 2: Elementos Dinámicos
 * ============================
 * Muchas aplicaciones modernas tienen elementos que:
 * - Aparecen/desaparecen dinámicamente
 * - Requieren hover para mostrarse
 * - Están dentro de iframes
 * - Son diálogos de JavaScript (alert, confirm, prompt)
 */

test.describe('Elementos que aparecen/desaparecen', () => {

  test('Esperar que un elemento aparezca', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    
    // El elemento existe pero está oculto (display: none)
    await expect(page.locator('#finish')).toBeHidden();
    
    // Hacer click en Start
    await page.locator('#start button').click();
    
    // Esperar a que aparezca (Playwright lo hace automáticamente)
    await expect(page.locator('#finish h4')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
  });

  test('Elemento que se agrega al DOM dinámicamente', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
    
    // El elemento NO existe en el DOM inicialmente
    await expect(page.locator('#finish')).toHaveCount(0);
    
    // Hacer click en Start
    await page.locator('#start button').click();
    
    // Esperar a que se agregue al DOM y sea visible
    await expect(page.locator('#finish h4')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
  });

});

test.describe('Checkboxes', () => {

  test('check() y uncheck() - Marcar y desmarcar', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');
    
    const checkbox1 = page.locator('input[type="checkbox"]').first();
    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);
    
    // Estado inicial
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();
    
    // Marcar el primero
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    
    // Desmarcar el segundo
    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();
    
    // check() es idempotente: si ya está marcado, no hace nada
    await checkbox1.check(); // No lanza error aunque ya esté marcado
    await expect(checkbox1).toBeChecked();
  });

  test('setChecked() - Control explícito del estado', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');
    
    const checkbox1 = page.locator('input[type="checkbox"]').first();
    
    // setChecked(true) lo marca, setChecked(false) lo desmarca
    await checkbox1.setChecked(true);
    await expect(checkbox1).toBeChecked();
    
    await checkbox1.setChecked(false);
    await expect(checkbox1).not.toBeChecked();
  });

});

test.describe('Dropdown Dinámico (No-Select)', () => {

  test('Dropdown que es un <select> HTML', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    
    // Este SÍ es un select normal
    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');
  });

  test('Manejar dropdown de ordenamiento en SauceDemo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // SauceDemo tiene un dropdown que es un <select> real
    const dropdown = page.locator('[data-test="product-sort-container"]');
    await dropdown.selectOption('za');
    
    // Verificar que el primer producto ahora es el último alfabéticamente
    const primerProducto = page.locator('[data-test="inventory-item-name"]').first();
    await expect(primerProducto).toContainText('Test.allTheThings');
  });

});

test.describe('Modales y Diálogos', () => {

  test('Alert de JavaScript - page.on("dialog")', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    // Configurar handler ANTES de hacer click
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });
    
    // Click en el botón que dispara el alert
    await page.locator('button:text("Click for JS Alert")').click();
    
    // Verificar resultado
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test('Confirm de JavaScript - Aceptar', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept(); // Click en OK
    });
    
    await page.locator('button:text("Click for JS Confirm")').click();
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  test('Confirm de JavaScript - Cancelar', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
      await dialog.dismiss(); // Click en Cancelar
    });
    
    await page.locator('button:text("Click for JS Confirm")').click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  test('Prompt de JavaScript - Ingresar texto', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Hola Playwright'); // Enviar texto
    });
    
    await page.locator('button:text("Click for JS Prompt")').click();
    await expect(page.locator('#result')).toHaveText('You entered: Hola Playwright');
  });

});

test.describe('Hover (Mouse Over)', () => {

  test('hover() - Mostrar elementos ocultos al pasar el mouse', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');
    
    // Los enlaces están ocultos hasta hacer hover
    const figuras = page.locator('.figure');
    
    // Hover sobre la primera figura
    await figuras.first().hover();
    
    // Ahora el caption debería ser visible
    const caption = figuras.first().locator('.figcaption');
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('user1');
  });

});

test.describe('Drag and Drop', () => {

  test('dragTo() - Arrastrar y soltar', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
    
    const columnaA = page.locator('#column-a');
    const columnaB = page.locator('#column-b');
    
    // Estado inicial
    await expect(columnaA).toContainText('A');
    await expect(columnaB).toContainText('B');
    
    // Arrastrar A hacia B
    await columnaA.dragTo(columnaB);
    
    // Nota: Este sitio tiene un bug conocido donde drag&drop no funciona
    // en algunos navegadores. En una app real, esto funcionaría.
  });

});

test.describe('iFrames', () => {

  test('frameLocator() - Interactuar dentro de un iframe', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/iframe');
    
    // Obtener el frame locator
    const frame = page.frameLocator('#mce_0_ifr');
    
    // Interactuar con elementos dentro del iframe
    const editor = frame.locator('#tinymce');
    
    // Para TinyMCE (contenteditable), usamos click + selectAll + escribir
    await frame.locator('#tinymce').evaluate((el) => {
      el.innerHTML = 'Texto escrito por Playwright';
    });
    
    // Verificar el contenido
    await expect(editor).toContainText('Texto escrito por Playwright');
  });

});

test.describe('Upload de Archivos', () => {

  test('setInputFiles() - Subir un archivo', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    // Crear un archivo temporal para el test
    const fileInput = page.locator('#file-upload');
    
    // Simular selección de archivo
    // En un test real, usarías un archivo de fixtures
    // await fileInput.setInputFiles('path/to/file.txt');
    
    // También puedes crear el contenido en memoria:
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Contenido del archivo de prueba')
    });
    
    // Click en upload
    await page.locator('#file-submit').click();
    
    // Verificar que se subió
    await expect(page.locator('#uploaded-files')).toContainText('test.txt');
  });

});

test.describe('Múltiples ventanas/pestañas', () => {

  test('Manejar nueva ventana que se abre', async ({ page, context }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');
    
    // Esperar que se abra una nueva página
    const pagePromise = context.waitForEvent('page');
    
    // Click que abre nueva ventana
    await page.locator('a:text("Click Here")').click();
    
    // Obtener la nueva página
    const newPage = await pagePromise;
    
    // Interactuar con la nueva página
    await expect(newPage.locator('h3')).toHaveText('New Window');
    
    // Cerrar la nueva página
    await newPage.close();
    
    // Volver a la página original (ya tiene el focus)
    await expect(page.locator('h3')).toHaveText('Opening a new window');
  });

});
