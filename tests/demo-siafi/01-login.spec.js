// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Login en Demo SIAFI', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://siafi.test.runaid.com.ar/ords/r/demo/siafi/login');
  });

  test('Login éxitoso', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const loginButton = page.locator('[data-otel-label="LOGIN"]');

    await username.fill('demo');
    await password.fill('demosiafi');
    await loginButton.click();

    const siafiHeading = page.getByRole('heading', { name: 'SIAFI' });

    await expect(siafiHeading).toHaveText('SIAFI');
  });

  test('Login fallido', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const loginButton = page.locator('[data-otel-label="LOGIN"]');

    await username.fill('usuarioIncorrecto');
    await password.fill('contraseñaIncorrecta');
    await loginButton.click();

    const invalidCredentials = page.getByRole('alert');

    await expect(invalidCredentials).toContainText('Invalid Login Credentials');
  });
});

test.describe('Busqueda en DEMO SIAFI', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://siafi.test.runaid.com.ar/ords/r/demo/siafi/login');

    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const loginButton = page.locator('[data-otel-label="LOGIN"]');

    await username.fill('demo');
    await password.fill('demosiafi');
    await loginButton.click();

    const siafiHeading = page.getByRole('heading', { name: 'SIAFI' });

    await expect(siafiHeading).toHaveText('SIAFI');
  });

  test('Acceso a Gastos de Fondos Rotatorios', async ({ page }) => {
    const navigationButton = page.getByRole('button', { name: 'Main Navigation' });
    navigationButton.click();

    const gastosDeFondosRotatoriosTreeItem = page.getByRole('treeitem', { name: 'Gastos de Fondos Rotatorios' });
    await expect(gastosDeFondosRotatoriosTreeItem).toBeVisible({ timeout: 15_000 });
    await gastosDeFondosRotatoriosTreeItem.click();

    await expect(page.getByRole('heading', { name: 'Gastos de Fondos Rotatorios', level: 1 })).toBeVisible();
  });

  test('Busqueda de registro con número de documento 441', async ({ page }) => {
    const navigationButton = page.getByRole('button', { name: 'Main Navigation' });
    navigationButton.click();

    const gastosDeFondosRotatoriosTreeItem = page.getByRole('treeitem', { name: 'Gastos de Fondos Rotatorios' });
    await expect(gastosDeFondosRotatoriosTreeItem).toBeVisible({ timeout: 15_000 });
    await gastosDeFondosRotatoriosTreeItem.click();
    await expect(page.getByRole('heading', { name: 'Gastos de Fondos Rotatorios', level: 1 })).toBeVisible();

    const actionsButton = page.getByRole('button', { name: 'Actions' });
    await actionsButton.click();

    const filterButton = page.getByRole('menuitem', { name: 'Filter' });
    await filterButton.click();

    const filtersDialog = page.getByRole('dialog', { name: 'Filters' }); //Se obtiene la ventana de Filters, para limitar la busqueda de los siguientes locators solo a aquellos dentro de esta

    // 1️⃣ Tipo de filtro = Column
    await expect(filtersDialog.locator('#ig_gastos_ig_FD_TYPE')).toHaveValue('column');

    // 2️⃣ Columna = Nº Documento
    await expect(filtersDialog.locator('#ig_gastos_ig_FD_COLUMN')).toHaveValue('3091268179047411');

    // 3️⃣ Operador = equals
    await expect(filtersDialog.locator('#ig_gastos_ig_FD_OPERATOR')).toHaveValue('EQ');

    const valueInput = filtersDialog.locator('#ig_gastos_ig_FD_VALUE');
    await valueInput.fill('441');

    // Click en Save
    await filtersDialog.getByRole('button', { name: 'Save' }).click();

    // Espera a que el diálogo de filtros se cierre
    await expect(filtersDialog).toBeHidden({ timeout: 15_000 });

    // Espera a que APEX termine de procesar (spinner global)
    const processing = page.locator('body > .u-Processing');
    await processing.waitFor({ state: 'hidden', timeout: 15_000 });

    const firstRow = page
      .locator('#ig_gastos_ig table.a-GV-table tbody tr')
      .first();

    // espera a que la fila tenga datos reales
    await expect(firstRow).toBeVisible();

    // valida que en la fila exista la celda con "441"
    await expect(
      firstRow.getByRole('gridcell', { name: '441' })
    ).toBeVisible();

  })
})