import { test, expect } from '@playwright/test';

test('1. Ingreso a Registro Beneficiarios', async({page}) => {
    await page.goto('https://orion.sefin.gob.hn/teso/teso-ben-prb-app/');
    await expect(page.locator('layout-menu').getByRole('img', { name: 'Logo' })).toBeVisible();

    await page.getByRole('button').nth(2).click();
    await page.getByRole('menuitem', { name: 'Iniciar sesión' }).click();
    await expect(page).toHaveURL(/chara.sefin.gob.hn.*/);

    await page.getByRole('link', { name: 'Crear cuenta' }).click();
    await expect(page).toHaveURL(/.*NuevoUsuarioAnonimo/);
    await expect(page).toHaveTitle('REGISTRO DE SOLICITUD DE USUARIO');

    await page.locator('select[name="SOLICITANTE.TIPO_ID"]').selectOption('RTN');
    await page.getByRole('textbox', { name: 'Nro Id' }).pressSequentially('2323232323232', { delay: 100 });
    await page.getByRole('textbox', { name: 'Fecha Nacimiento' }).pressSequentially('01/01/2000');
    await page.getByTitle('Honduras: +').first().click();
    await page.getByRole('listitem').filter({ hasText: 'Benin (Bénin)+' }).click();
    await page.getByRole('button', { name: 'Guardar' }).click();
});