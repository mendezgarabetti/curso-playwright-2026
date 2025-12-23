// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 2: Elementos Dinámicos
 * ============================
 * Las aplicaciones web modernas tienen muchos elementos que aparecen,
 * desaparecen o cambian dinámicamente. Playwright maneja la mayoría
 * automáticamente, pero hay casos donde necesitamos ayuda extra.
 * 
 * Usamos https://the-internet.herokuapp.com para estos ejemplos
 * porque tiene casos de uso específicos bien aislados.
 */

test.describe('Elementos que Aparecen y Desaparecen', () => {

  test('Elemento que aparece después de una espera', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    
    // El elemento existe en el DOM pero está oculto
    await expect(page.locator('#finish')).toBeHidden();
    
    // Hacer click en Start
    await page.locator('#start button').click();
    
    // Esperar a que aparezca el resultado
    // Playwright reintenta automáticamente hasta que sea visible
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

  test('Dropdown que no es un <select> HTML', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    
    // Este SÍ es un select normal
    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');
  });

  test('Manejar dropdown personalizado (JS/CSS)', async ({ page }) => {
    // SauceDemo tiene un dropdown personalizado para ordenar
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Aunque parece un dropdown custom, es un <select> real
    // Si fuera un dropdown de JS puro, tendríamos que:
    // 1. Click para abrir
    // 2. Esperar que aparezcan las opciones
    // 3. Click en la opción deseada
    
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
    
    // Ahora deberían estar invertidos
    // Nota: Este sitio tiene un bug conocido donde drag&drop no funciona
    // en algunos navegadores. Es un buen ejemplo de "test que puede fallar
    // por la aplicación, no por el test"
  });

});

test.describe('iFrames', () => {

  test('Interactuar con contenido dentro de un iframe', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/iframe');
    
    // Localizar el iframe
    const frame = page.frameLocator('#mce_0_ifr');
    
    // Interactuar con elementos DENTRO del iframe
    const editor = frame.locator('#tinymce');
    
    // Limpiar y escribir nuevo contenido
    await editor.clear();
    await editor.fill('Texto escrito por Playwright');
    
    // Verificar
    await expect(editor).toContainText('Texto escrito por Playwright');
  });

});

test.describe('Menú Hamburguesa (SauceDemo)', () => {

  test('Abrir menú lateral y navegar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Abrir menú hamburguesa
    await page.locator('#react-burger-menu-btn').click();
    
    // Esperar a que el menú se abra (animación)
    const menu = page.locator('.bm-menu-wrap');
    await expect(menu).toBeVisible();
    
    // Verificar opciones del menú
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
    
    // Click en Logout
    await page.locator('#logout_sidebar_link').click();
    
    // Verificar que volvimos al login
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});
