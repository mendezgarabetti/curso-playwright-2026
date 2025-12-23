# Clase 05: Pruebas Híbridas y Simulación de Red

## 📋 Contenido de esta carpeta

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `01-api-testing-basico.spec.js` | Demo | GET, POST, PUT, DELETE con JSONPlaceholder |
| `02-api-context.spec.js` | Demo | API Context con configuración compartida |
| `03-intercepcion-red.spec.js` | Demo | page.route(), bloquear, modificar |
| `04-pruebas-hibridas.spec.js` | Demo | API Setup + UI Test |
| `05-mocking-avanzado.spec.js` | Demo | Casos de uso reales |
| `ejercicio-01-api-testing.spec.js` | Práctica | Ejercicios de API Testing |
| `ejercicio-02-mocking.spec.js` | Práctica | Ejercicios de Network Mocking |
| `_SOLUCIONES_EJERCICIOS.spec.js` | Instructor | Soluciones (no compartir) |

## 🎯 Objetivos de la clase

Al finalizar esta clase, los participantes podrán:

1. **Realizar pruebas de API** con Playwright (GET, POST, PUT, DELETE)
2. **Interceptar requests de red** usando `page.route()`
3. **Mockear responses** para simular diferentes escenarios
4. **Combinar API + UI** en pruebas híbridas
5. **Simular errores** del servidor (500, 404, timeout)

## 🚀 Comandos útiles

```bash
# Ejecutar demos de API
npx playwright test 01-api-testing --project=chromium

# Ejecutar demos de mocking
npx playwright test 03-intercepcion --project=chromium

# Ejecutar ejercicios
npx playwright test ejercicio --project=chromium

# Ver reporte
npx playwright show-report
```

## 📚 Conceptos cubiertos

### API Testing con Playwright

```javascript
// GET
const response = await request.get('https://api.example.com/users');
expect(response.status()).toBe(200);
const data = await response.json();

// POST
const response = await request.post('https://api.example.com/users', {
  data: { name: 'Test', email: 'test@test.com' }
});

// Con headers
const response = await request.get('/endpoint', {
  headers: { 'Authorization': 'Bearer token' }
});

// Con query params
const response = await request.get('/posts', {
  params: { userId: 1, limit: 10 }
});
```

### Network Interception

```javascript
// Interceptar y continuar (observar)
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
    body: JSON.stringify([{ id: 1, name: 'Mock User' }])
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

### Patrones de Pruebas Híbridas

| Patrón | Uso |
|--------|-----|
| API Setup + UI Test | Crear datos vía API, verificar en UI |
| UI Action + API Verify | Acción en UI, verificar estado vía API |
| Mock Backend | Simular respuestas sin backend real |
| Error Simulation | Probar manejo de errores (500, 404, timeout) |

### Tipos de Recursos que se pueden interceptar

```javascript
const resourceType = route.request().resourceType();
// Tipos: 'document', 'script', 'stylesheet', 'image', 'font', 
//        'xhr', 'fetch', 'websocket', 'other'
```

## ✏️ Ejercicios

### Ejercicio 1: API Testing
- GET requests con validación de estructura
- POST requests con creación de datos
- Manejo de errores (404)
- Validación de schemas
- CRUD completo

### Ejercicio 2: Network Mocking
- Contar requests interceptados
- Bloquear recursos para acelerar tests
- Mockear respuestas de API
- Simular errores del servidor
- Modificar respuestas en vuelo

## ⏰ Distribución de tiempo sugerida

| Bloque | Duración |
|--------|----------|
| Repaso Día 4 + Preview | 10 min |
| API Testing: Conceptos | 20 min |
| Demo: GET, POST, PUT, DELETE | 25 min |
| API Context y headers | 15 min |
| *Break* | 10 min |
| Network Interception | 20 min |
| Mocking de Responses | 25 min |
| Demo: Simular errores | 15 min |
| *Break* | 10 min |
| Pruebas Híbridas | 25 min |
| **Ejercicios** | 40 min |
| Cierre | 5 min |
| **Total** | **4 horas** |

## 🔧 Configuración recomendada

Para API testing con baseURL en `playwright.config.js`:

```javascript
use: {
  baseURL: 'https://api.example.com',
  extraHTTPHeaders: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
}
```

## 📖 Casos de uso comunes

### Acelerar tests bloqueando recursos

```javascript
// Bloquear imágenes, fuentes y analytics
await page.route('**/*', async (route) => {
  const type = route.request().resourceType();
  if (['image', 'font', 'media'].includes(type)) {
    return route.abort();
  }
  await route.continue();
});
```

### Simular respuesta lenta

```javascript
await page.route('**/api/slow', async (route) => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  await route.fulfill({ status: 200, body: '{"ok": true}' });
});
```

### Simular diferentes estados

```javascript
// Carrito vacío
await page.route('**/api/cart', route => 
  route.fulfill({ body: '[]' })
);

// Usuario sin permisos
await page.route('**/api/admin/**', route =>
  route.fulfill({ status: 403 })
);
```

## 📖 Próxima clase

**Día 6: Integración Continua y Ejecución en la Nube**
- Configuración para múltiples entornos
- Ejecución en diferentes navegadores
- CI/CD con GitHub Actions
- Reportes ejecutivos
