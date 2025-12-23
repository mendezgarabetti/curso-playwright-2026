// @ts-check
const { test, expect, request } = require('@playwright/test');

/**
 * CLASE 5: API Request Context
 * ============================
 * Cuando hacemos múltiples requests a la misma API,
 * podemos crear un "contexto" con configuración compartida:
 * - Base URL
 * - Headers comunes (autenticación)
 * - Cookies
 */

test.describe('API Context: Configuración Compartida', () => {

  // Crear un contexto de API reutilizable
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    // Crear contexto con configuración base
    apiContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'X-API-Version': '1.0'
      }
    });
  });

  test.afterAll(async () => {
    // Limpiar el contexto
    await apiContext.dispose();
  });

  test('GET usando baseURL', async () => {
    // Solo especificamos el path, no la URL completa
    const response = await apiContext.get('/users');
    
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(users.length).toBe(10);
  });

  test('GET con parámetros', async () => {
    const response = await apiContext.get('/posts', {
      params: { userId: 1 }
    });
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(posts.length).toBe(10); // Usuario 1 tiene 10 posts
  });

  test('POST usando el contexto', async () => {
    const response = await apiContext.post('/posts', {
      data: {
        title: 'Nuevo Post',
        body: 'Contenido',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(201);
  });

});

test.describe('API Context: Simulando Autenticación', () => {

  /**
   * En una API real, típicamente:
   * 1. Hacemos login para obtener un token
   * 2. Usamos ese token en los siguientes requests
   */

  test('Flujo de autenticación simulado', async ({ playwright }) => {
    // 1. Simular login (en una API real, esto devolvería un token)
    const loginContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });
    
    // Simular obtención de token (JSONPlaceholder no tiene auth real)
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token';
    
    // 2. Crear contexto autenticado
    const authContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${fakeToken}`,
        'Accept': 'application/json'
      }
    });
    
    // 3. Usar el contexto autenticado
    const response = await authContext.get('/posts/1');
    expect(response.status()).toBe(200);
    
    // 4. Limpiar
    await loginContext.dispose();
    await authContext.dispose();
  });

});

test.describe('API Context: Reutilización con Fixtures', () => {

  /**
   * Podemos crear un fixture personalizado para el API context
   * Ver archivo fixtures-api.js para implementación completa
   */

  test('Ejemplo de uso con fixture (conceptual)', async ({ request }) => {
    // El fixture `request` ya viene configurado por Playwright
    // Podemos extenderlo en playwright.config.js:
    //
    // use: {
    //   baseURL: 'https://api.example.com',
    //   extraHTTPHeaders: {
    //     'Authorization': `Bearer ${process.env.API_TOKEN}`
    //   }
    // }
    
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    expect(response.status()).toBe(200);
  });

});

test.describe('API Testing: Timeout y Reintentos', () => {

  test('Request con timeout personalizado', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
      timeout: 30000 // 30 segundos
    });
    
    expect(response.status()).toBe(200);
  });

  test('Manejo de timeout (simulado)', async ({ request }) => {
    // En un caso real, podríamos usar un servidor de prueba lento
    // Aquí solo demostramos el patrón
    
    try {
      const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
        timeout: 60000
      });
      expect(response.status()).toBe(200);
    } catch (error) {
      // Si hay timeout, lo manejamos
      console.log('Request timeout:', error.message);
      throw error;
    }
  });

});
