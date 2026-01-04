// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CLASE 5: API Testing Básico
 * ===========================
 * Playwright puede hacer requests HTTP directamente.
 */

test.describe('API Testing: Métodos HTTP', () => {

  test('GET - Obtener un recurso', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toBeDefined();
  });

  test('GET - Obtener lista de recursos', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  test('POST - Crear recurso', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Test Post',
        body: 'Contenido del post',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body.title).toBe('Test Post');
    expect(body.id).toBeDefined();
  });

  test('PUT - Actualizar recurso', async ({ request }) => {
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
      data: {
        id: 1,
        title: 'Título Actualizado',
        body: 'Contenido actualizado',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Título Actualizado');
  });

  test('DELETE - Eliminar recurso', async ({ request }) => {
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);
  });

});

test.describe('API Testing: Headers', () => {

  test('Request con headers personalizados', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'Accept': 'application/json',
        'X-Custom-Header': 'valor-personalizado'
      }
    });
    
    expect(response.status()).toBe(200);
  });

  test('Verificar headers de respuesta', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

});

test.describe('API Testing: Manejo de Errores', () => {

  test('Manejar 404 Not Found', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/99999');
    expect(response.status()).toBe(404);
  });

});
