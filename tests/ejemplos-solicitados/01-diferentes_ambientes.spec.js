// @ts-check
import { test } from '@playwright/test';


/**
 * En el ejemplo solicitado donde se busca 
 */

test.describe('Prueba de ejecuciones en diferentes ambientes', () => {
    test('DEMO', async ({ page }) => {
        await page.goto('/');
        console.log('URL actual:', page.url());

        //$env:ENV="dev"; npx playwright test -g "Prueba de ejecuciones en diferentes ambientes"   -> Para utilizar la URL en dev
        //$env:ENV="test"; npx playwright test -g "Prueba de ejecuciones en diferentes ambientes"  -> Para utilizar la URL en test
    });
});

