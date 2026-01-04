// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  EJERCICIO 1: API Testing                                             ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║  Practicar requests HTTP con JSONPlaceholder                          ║
 * ║  URL: https://jsonplaceholder.typicode.com                            ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

test.describe('Ejercicio 1: GET Requests', () => {

  test('1.1 Obtener un post específico', async ({ request }) => {
    // TODO: Hacer GET a /posts/1
    // TODO: Verificar status 200
    // TODO: Verificar que el body tiene id, title, body, userId
  });

  test('1.2 Obtener posts de un usuario', async ({ request }) => {
    // TODO: Hacer GET a /posts con param userId=1
    // TODO: Verificar que todos los posts tienen userId=1
  });

  test('1.3 Obtener comentarios de un post', async ({ request }) => {
    // TODO: Hacer GET a /posts/1/comments
    // TODO: Verificar que hay al menos 1 comentario
    // TODO: Verificar que cada comentario tiene email
  });

});

test.describe('Ejercicio 2: POST Requests', () => {

  test('2.1 Crear un nuevo post', async ({ request }) => {
    // TODO: Hacer POST a /posts con title, body, userId
    // TODO: Verificar status 201
    // TODO: Verificar que la respuesta tiene id
  });

  test('2.2 Crear post y verificar datos', async ({ request }) => {
    const nuevoPost = {
      title: 'Mi Post de Prueba',
      body: 'Contenido del post',
      userId: 1
    };
    
    // TODO: Hacer POST con nuevoPost
    // TODO: Verificar que title y body coinciden
  });

});

test.describe('Ejercicio 3: CRUD Completo', () => {

  test('3.1 Flujo completo CRUD', async ({ request }) => {
    // CREATE
    // TODO: Crear un post
    
    // READ
    // TODO: Obtener el post creado
    
    // UPDATE
    // TODO: Actualizar el título del post
    
    // DELETE
    // TODO: Eliminar el post
  });

});

/**
 * CRITERIOS DE ÉXITO:
 * ✅ Todos los tests pasan
 * ✅ Se usan los métodos HTTP correctos
 * ✅ Se validan status codes
 * ✅ Se valida estructura del body
 */
