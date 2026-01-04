# Clase 05: Pruebas Híbridas y Simulación de Red

## 📋 Contenido

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `01-api-testing-basico.spec.js` | Demo | GET, POST, PUT, DELETE |
| `02-api-context.spec.js` | Demo | API Context con configuración compartida |
| `03-intercepcion-red.spec.js` | Demo | page.route(), bloquear, modificar |
| `04-pruebas-hibridas.spec.js` | Demo | API Setup + UI Test |
| `05-mocking-avanzado.spec.js` | Demo | Casos de uso reales |
| `ejercicio-01-api-testing.spec.js` | **Práctica** | API Testing |
| `ejercicio-02-mocking.spec.js` | **Práctica** | Network Mocking |

## 🎯 Objetivos

1. **Realizar pruebas de API** con Playwright
2. **Interceptar requests** usando `page.route()`
3. **Mockear responses** para simular escenarios
4. **Combinar API + UI** en pruebas híbridas
5. **Simular errores** del servidor

## 📚 API Testing

```javascript
import { test, expect } from '@playwright/test';

// GET
const response = await request.get('https://api.example.com/users');
expect(response.status()).toBe(200);
const data = await response.json();

// POST
const response = await request.post('/users', {
  data: { name: 'Test', email: 'test@test.com' }
});

// Con headers
const response = await request.get('/endpoint', {
  headers: { 'Authorization': 'Bearer token' }
});
```

## 📚 Network Interception

```javascript
// Interceptar y continuar
await page.route('**/*', async (route) => {
  console.log('Request:', route.request().url());
  await route.continue();
});

// Bloquear recursos
await page.route('**/*.{png,jpg}', route => route.abort());

// Mockear respuesta
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock' }])
  });
});

// Modificar respuesta real
await page.route('**/api/data', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.modified = true;
  await route.fulfill({ response, body: JSON.stringify(json) });
});
```

## 🚀 Comandos útiles

```bash
npx playwright test 01-api-testing --project=chromium
npx playwright test 03-intercepcion --project=chromium
npx playwright test ejercicio --project=chromium
```

## 📖 Próxima clase

**Día 6: Integración Continua y Ejecución en la Nube**
