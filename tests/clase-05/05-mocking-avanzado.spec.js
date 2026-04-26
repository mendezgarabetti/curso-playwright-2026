// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 5: Mocking Avanzado - Conduit (UI + API)
 * ===============================================
 */

const BASE_URL = 'https://conduit.bondaracademy.com';

test.describe('Caso 1: Simular Estados de Error', () => {

  test('Simular error 500 en carga de artículos', async ({ page }) => {

    await page.route('**/api/articles*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error'
        })
      });
    });

    await page.goto(BASE_URL);

    await expect(page.locator('app-article-list')).toBeVisible();
  });

  test('Simular error 401 (no autenticado)', async ({ page }) => {

    await page.route('**/api/user', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized'
        })
      });
    });

    await page.goto(BASE_URL);

    await expect(page.locator('text=Sign in')).toBeVisible();
  });

});

test.describe('Caso 2: Simular Datos Específicos', () => {

  test('Lista de artículos vacía', async ({ page }) => {

    await page.route('**/api/articles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          articles: [],
          articlesCount: 0
        })
      });
    });

    await page.goto(BASE_URL);

    await expect(page.locator('text=No articles are here... yet.')).toBeVisible();
  });

  test('Lista con datos mockeados', async ({ page }) => {

    await page.route('**/api/articles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          articles: [
            {
              title: '🚀 Artículo Mockeado',
              description: 'Este contenido no viene del backend',
              body: 'Mock completo',
              tagList: [],
              createdAt: new Date().toISOString(),
              author: {
                username: 'mock-user'
              }
            }
          ],
          articlesCount: 1
        })
      });
    });

    await page.goto(BASE_URL);

    await expect(page.locator('text=🚀 Artículo Mockeado')).toBeVisible();
  });

});

test.describe('Caso 3: Simular Comportamientos de Red', () => {

  test('Conexión lenta', async ({ page }) => {

    await page.route('**/api/articles*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.goto(BASE_URL);

    await expect(page.locator('app-article-list')).toBeVisible();
  });

  test('Respuestas condicionales (fallo y recuperación)', async ({ page }) => {

    let requestCount = 0;

    await page.route('**/api/articles*', async (route) => {
      requestCount++;

      if (requestCount === 1) {
        await route.fulfill({ status: 500 });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            articles: [],
            articlesCount: 0
          })
        });
      }
    });

    await page.goto(BASE_URL);
  });

});

test.describe('Caso 4: Modificar Respuesta Real', () => {

  test('Modificar datos reales de la API', async ({ page }) => {

    await page.route('**/api/articles*', async (route) => {
      const response = await route.fetch();
      const json = await response.json();

      json.articles[0].title = '🔥 MODIFICADO DESDE PLAYWRIGHT';

      await route.fulfill({
        response,
        body: JSON.stringify(json)
      });
    });

    await page.goto(BASE_URL);

    await expect(page.locator('text=🔥 MODIFICADO DESDE PLAYWRIGHT')).toBeVisible();
  });
});