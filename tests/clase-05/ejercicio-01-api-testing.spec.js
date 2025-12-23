// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO 1: API Testing                                             ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Completar los tests de API usando JSONPlaceholder                    ║
 * ║  URL Base: https://jsonplaceholder.typicode.com                       ║
 * ║                                                                       ║
 * ║  Endpoints disponibles:                                               ║
 * ║  - GET /users         - Lista de usuarios                             ║
 * ║  - GET /users/:id     - Usuario específico                            ║
 * ║  - GET /posts         - Lista de posts                                ║
 * ║  - GET /posts/:id     - Post específico                               ║
 * ║  - POST /posts        - Crear post                                    ║
 * ║  - PUT /posts/:id     - Actualizar post                               ║
 * ║  - DELETE /posts/:id  - Eliminar post                                 ║
 * ║  - GET /posts?userId=X - Posts de un usuario                          ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Ejercicio 1: GET Requests', () => {

  test('1.1 Obtener todos los usuarios', async ({ request }) => {
    // TODO: Hacer GET a /users
    // TODO: Verificar status 200
    // TODO: Verificar que hay 10 usuarios
    // TODO: Verificar que el primer usuario tiene id, name y email
    
    const response = await request.get(`${BASE_URL}/users`);
    
    // Completar las aserciones:
    // expect(response.status()).toBe(???);
    // const users = await response.json();
    // expect(users.length).toBe(???);
  });

  test('1.2 Obtener usuario por ID', async ({ request }) => {
    // TODO: Obtener el usuario con ID 5
    // TODO: Verificar que el nombre es "Chelsey Dietrich"
    // TODO: Verificar que tiene dirección con ciudad "Roscoeview"
    
    // const response = await request.get(`${BASE_URL}/users/???`);
  });

  test('1.3 Obtener posts de un usuario específico', async ({ request }) => {
    // TODO: Obtener los posts del usuario 1 usando query params
    // TODO: Verificar que todos los posts tienen userId = 1
    // TODO: Verificar que hay exactamente 10 posts
    
    // const response = await request.get(`${BASE_URL}/posts`, {
    //   params: { ??? }
    // });
  });

  test('1.4 Manejar recurso inexistente (404)', async ({ request }) => {
    // TODO: Intentar obtener un usuario que no existe (ID 9999)
    // TODO: Verificar que response.ok() es false
    // TODO: Verificar el status code apropiado
    
  });

});

test.describe('Ejercicio 2: POST Requests', () => {

  test('2.1 Crear un nuevo post', async ({ request }) => {
    // TODO: Crear un post con:
    //   - title: "Mi Post de Prueba"
    //   - body: "Este es el contenido del post"
    //   - userId: 1
    // TODO: Verificar status 201
    // TODO: Verificar que la respuesta incluye un id
    // TODO: Verificar que los datos enviados se devuelven correctamente
    
    // const response = await request.post(`${BASE_URL}/posts`, {
    //   data: { ??? }
    // });
  });

  test('2.2 POST con headers personalizados', async ({ request }) => {
    // TODO: Crear un post incluyendo estos headers:
    //   - Content-Type: application/json
    //   - X-Custom-Header: test-value
    // TODO: Verificar que el post se crea correctamente
    
  });

});

test.describe('Ejercicio 3: PUT y DELETE', () => {

  test('3.1 Actualizar un post existente', async ({ request }) => {
    // TODO: Actualizar el post con ID 1
    // TODO: Cambiar el título a "Título Actualizado"
    // TODO: Verificar status 200
    // TODO: Verificar que el título cambió
    
  });

  test('3.2 Eliminar un post', async ({ request }) => {
    // TODO: Eliminar el post con ID 1
    // TODO: Verificar que la operación fue exitosa
    
  });

});

test.describe('Ejercicio 4: Validación de Datos', () => {

  test('4.1 Validar estructura de usuario', async ({ request }) => {
    // TODO: Obtener el usuario 1
    // TODO: Verificar que tiene estas propiedades:
    //   - id (number)
    //   - name (string)
    //   - username (string)
    //   - email (string con formato válido)
    //   - address (objeto con street, city, zipcode)
    //   - company (objeto con name)
    
    // const response = await request.get(`${BASE_URL}/users/1`);
    // const user = await response.json();
    
    // expect(user).toHaveProperty('id');
    // expect(typeof user.id).toBe('number');
    // ... continuar validaciones
  });

  test('4.2 Validar que todos los emails son únicos', async ({ request }) => {
    // TODO: Obtener todos los usuarios
    // TODO: Extraer todos los emails a un array
    // TODO: Verificar que no hay emails duplicados
    // PISTA: Comparar length del array con length de un Set
    
  });

});

test.describe('Ejercicio 5: BONUS - Flujo Completo', () => {

  test('5.1 CRUD completo de un post', async ({ request }) => {
    // TODO: Implementar un flujo completo:
    // 1. CREATE: Crear un nuevo post
    // 2. READ: Leer el post creado y verificar datos
    // 3. UPDATE: Actualizar el título del post
    // 4. DELETE: Eliminar el post
    
    // Paso 1: CREATE
    // const createResponse = await request.post(...)
    
    // Paso 2: READ
    // const readResponse = await request.get(...)
    
    // Paso 3: UPDATE
    // const updateResponse = await request.put(...)
    
    // Paso 4: DELETE
    // const deleteResponse = await request.delete(...)
  });

});
