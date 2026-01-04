// @ts-check
import { test, expect, request } from '@playwright/test';

/**
 * CLASE 5: API Context
 * ====================
 * Crear un contexto de API reutilizable con configuración compartida.
 */

test.describe('API Context Básico', () => {

  test('Crear contexto con baseURL', async ({ playwright }) => {
    const apiContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Accept': 'application/json'
      }
    });
    
    // Ahora podemos usar rutas relativas
    const response = await apiContext.get('/posts/1');
    expect(response.status()).toBe(200);
    
    const posts = await apiContext.get('/posts');
    expect(response.ok()).toBeTruthy();
    
    // Limpiar
    await apiContext.dispose();
  });

});

test.describe('API Context con Autenticación', () => {

  test('Contexto con Bearer Token', async ({ playwright }) => {
    const apiContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Authorization': 'Bearer fake-token-for-demo'
      }
    });
    
    const response = await apiContext.get('/posts/1');
    expect(response.status()).toBe(200);
    
    await apiContext.dispose();
  });

});

test.describe('API Testing con Query Params', () => {

  test('GET con parámetros de query', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        userId: 1,
        _limit: 5
      }
    });
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(posts.length).toBeLessThanOrEqual(5);
    posts.forEach(post => {
      expect(post.userId).toBe(1);
    });
  });

});
