// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CLASE 5: Pruebas de API con Playwright
 * ======================================
 * Playwright no es solo para UI - también puede hacer requests HTTP directos.
 * 
 * ¿Por qué probar APIs con Playwright?
 * - Preparar datos antes de tests de UI (setup)
 * - Verificar estado del backend después de acciones de UI
 * - Tests más rápidos que los de UI
 * - Validar contratos de API
 * 
 * El objeto `request` está disponible en cada test.
 */

test.describe('API Testing: Conceptos Básicos', () => {

  test('GET simple - Obtener lista de usuarios', async ({ request }) => {
    // Hacer request GET a una API pública
    const response = await request.get('https://jsonplaceholder.typicode.com/users');
    
    // Verificar status code
    expect(response.status()).toBe(200);
    
    // Verificar que es OK
    expect(response.ok()).toBe(true);
    
    // Obtener el body como JSON
    const users = await response.json();
    
    // Verificar estructura de datos
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Verificar campos del primer usuario
    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
  });

  test('GET con parámetro - Obtener usuario específico', async ({ request }) => {
    const userId = 1;
    const response = await request.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    
    expect(user.id).toBe(userId);
    expect(user.name).toBe('Leanne Graham');
    expect(user.email).toBe('Sincere@april.biz');
  });

  test('GET con query params', async ({ request }) => {
    // Los posts del usuario 1
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        userId: 1
      }
    });
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    
    // Todos los posts deben ser del usuario 1
    posts.forEach(post => {
      expect(post.userId).toBe(1);
    });
  });

  test('POST - Crear nuevo recurso', async ({ request }) => {
    const newPost = {
      title: 'Test Post desde Playwright',
      body: 'Este es el contenido del post de prueba',
      userId: 1
    };
    
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: newPost
    });
    
    // 201 Created
    expect(response.status()).toBe(201);
    
    const createdPost = await response.json();
    
    // JSONPlaceholder devuelve el objeto con un ID asignado
    expect(createdPost.id).toBeDefined();
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
  });

  test('PUT - Actualizar recurso completo', async ({ request }) => {
    const updatedPost = {
      id: 1,
      title: 'Título Actualizado',
      body: 'Contenido actualizado',
      userId: 1
    };
    
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
      data: updatedPost
    });
    
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result.title).toBe(updatedPost.title);
  });

  test('PATCH - Actualizar parcialmente', async ({ request }) => {
    const partialUpdate = {
      title: 'Solo cambio el título'
    };
    
    const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
      data: partialUpdate
    });
    
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result.title).toBe(partialUpdate.title);
    // El body original se mantiene
    expect(result.body).toBeDefined();
  });

  test('DELETE - Eliminar recurso', async ({ request }) => {
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
    
    // 200 OK para delete exitoso
    expect(response.status()).toBe(200);
  });

});

test.describe('API Testing: Headers y Autenticación', () => {

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
    
    // Obtener headers de respuesta
    const contentType = response.headers()['content-type'];
    
    expect(contentType).toContain('application/json');
  });

  test('POST con Content-Type específico', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Test',
        body: 'Content',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(201);
  });

});

test.describe('API Testing: Manejo de Errores', () => {

  test('Manejar 404 Not Found', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/99999');
    
    // JSONPlaceholder devuelve 404 para recursos inexistentes
    expect(response.status()).toBe(404);
    expect(response.ok()).toBe(false);
  });

  test('Verificar estructura de error', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/invalid-endpoint');
    
    // Verificar que NO es exitoso
    expect(response.ok()).toBe(false);
  });

});

test.describe('API Testing: Validación de Schemas', () => {

  test('Validar estructura de respuesta', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await response.json();
    
    // Verificar que tiene todas las propiedades requeridas
    const requiredFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'];
    
    requiredFields.forEach(field => {
      expect(user, `Campo ${field} faltante`).toHaveProperty(field);
    });
    
    // Verificar tipos de datos
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    
    // Verificar estructura anidada
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
    expect(user.address).toHaveProperty('geo');
    expect(user.address.geo).toHaveProperty('lat');
    expect(user.address.geo).toHaveProperty('lng');
  });

  test('Validar formato de email', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    users.forEach(user => {
      expect(user.email).toMatch(emailRegex);
    });
  });

});
