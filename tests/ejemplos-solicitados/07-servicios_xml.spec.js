import { test, expect } from '@playwright/test';

test.describe('Test XML con método GET', () => {
    test('GET XML - validar contenido', async ({ request }) => {
        const response = await request.get('https://www.w3schools.com/xml/simple.xml');

        expect(response.status()).toBe(200);

        const body = await response.text(); // 👈 XML se lee como texto

        // Validaciones simples
        expect(body).toContain('<breakfast_menu>');
        expect(body).toContain('<food>');
        expect(body).toContain('Belgian Waffles');
    });

    test('GET XML - extraer datos', async ({ request }) => {

        const response = await request.get('https://www.w3schools.com/xml/simple.xml');

        const xml = await response.text();

        // Extraer nombre de comida (simple regex)
        const match = xml.match(/<name>(.*?)<\/name>/);

        const foodName = match ? match[1] : null;

        expect(foodName).toBe('Belgian Waffles');
    });

    test('GET XML - múltiples elementos', async ({ request }) => {

        const response = await request.get('https://www.w3schools.com/xml/simple.xml');

        const xml = await response.text();

        const foods = [...xml.matchAll(/<name>(.*?)<\/name>/g)];

        const names = foods.map(f => f[1]);

        expect(names.length).toBeGreaterThan(1);
        expect(names).toContain('Belgian Waffles');
    });
});

test('POST XML - enviar y validar respuesta', async ({ request }) => {

  const xmlBody = `
    <user>
      <name>Gustavo</name>
      <role>QA</role>
    </user>
  `;

  const response = await request.post('https://httpbin.org/post', {
    headers: {
      'Content-Type': 'application/xml'
    },
    data: xmlBody
  });

  expect(response.status()).toBe(200);

  const body = await response.json(); // httpbin responde en JSON

  // 🔹 Validar que el XML llegó correctamente
  expect(body.data).toContain('<name>Gustavo</name>');
  expect(body.data).toContain('<role>QA</role>');
});

// Se recomienda el uso de una liberia en el caso de un proyecto real,
// ya que estos ejemplos no son escalables para XML complejos o varios
// Libreria recomendada: fast-xml-parser
// https://www.npmjs.com/package/fast-xml-parser