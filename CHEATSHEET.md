# ⚡ Playwright Cheatsheet (Hoja de Trucos)

Esta guía rápida resume los comandos esenciales y la sintaxis básica que utilizamos en el curso. Úsala como referencia rápida mientras trabajas.

---

## 🛠️ 1. Instalación y Configuración

Comandos necesarios para preparar el entorno antes de empezar.

| Comando | Descripción |
| :--- | :--- |
| `npm init playwright@latest` | **Crear Proyecto:** Inicializa un proyecto nuevo desde cero, crea archivos de configuración y descarga Playwright. |
| `npm install` | **Instalar Dependencias:** Ejecútalo si clonaste un repositorio existente (como el del curso) para bajar las librerías necesarias. |
| `npx playwright install` | **Descargar Navegadores:** Descarga los binarios de Chromium, Firefox y WebKit necesarios para ejecutar las pruebas. |

---

## 🏃‍♂️ 2. Ejecución de Tests

Por defecto, Playwright corre en modo "headless" (sin abrir ventana). Usa estas variantes para controlar la ejecución.

### Ejecución Básica

```bash
# Correr TODOS los tests del proyecto
npx playwright test

# Correr solo un archivo específico
npx playwright test tests/clase-02-e2e/tienda.spec.js

# Correr una carpeta completa (un módulo)
npx playwright test tests/clase-02-e2e
```

### Modos Visuales (Ver qué pasa)

```bash
# Ver el navegador mientras corre el test (Headed mode)
npx playwright test --headed

# Correr solo en un navegador específico (ej: Chrome)
# Útil para no abrir 3 ventanas a la vez al depurar.
npx playwright test --project=chromium --headed
```

---

## 🐞 3. Debugging y Herramientas

Herramientas para investigar por qué falló un test o entender el flujo.

### Modo UI (Interactivo) ⭐ Recomendado

Abre una interfaz gráfica potente. Permite ver la línea de tiempo, viajar al pasado ("time travel"), inspeccionar selectores y ver la consola.

```bash
npx playwright test --ui
```

### Modo Debug (Paso a paso)

Abre el navegador y el "Playwright Inspector". El test comienza pausado y debes avanzar línea por línea presionando `F10` o el botón "Step over".

```bash
npx playwright test --debug
```

### Generador de Código (Codegen)

Abre un navegador que "graba" tus clics y escribe el código por ti automáticamente.

```bash
npx playwright codegen https://www.saucedemo.com
```

---

## 📊 4. Reportes

Cómo ver los resultados después de una ejecución.

```bash
# Abrir el último reporte HTML generado
npx playwright show-report
```

> **Nota:** Esto abre un servidor local. Para cerrarlo, presiona `Ctrl + C` en la terminal.

---

## 💡 5. Sintaxis de Código (Reference)

### Estructura Básica de un Test

```javascript
// @ts-check
const { test, expect } = require('@playwright/test');

test('Nombre descriptivo del test', async ({ page }) => {
  // TU CÓDIGO AQUÍ
});
```

### Selectores (Locators)

Cómo encontrar elementos en la página (de mejor a peor práctica).

| Tipo | Ejemplo | Uso |
| :--- | :--- | :--- |
| **Atributos de Test** (El mejor) | `page.locator('[data-test="username"]')` | Elementos con atributo data-test |
| **Texto visible** | `page.getByText('Iniciar Sesión')` | Botones, enlaces, etiquetas |
| **Placeholders** | `page.getByPlaceholder('Buscar...')` | Inputs con placeholder |
| **Roles** (Accesibilidad) | `page.getByRole('button', { name: 'Enviar' })` | Elementos semánticos |
| **Filtrado** | `page.locator('.clase-comun').first()` | Si hay varios iguales |

### Acciones Comunes

Recuerda siempre usar `await`.

```javascript
await page.goto('https://sitio.com');       // Ir a URL
await locator.click();                       // Hacer clic
await locator.fill('texto');                 // Escribir en input
await locator.clear();                       // Limpiar input
await locator.check();                       // Marcar checkbox
await locator.selectOption('valor');         // Seleccionar dropdown
await page.pause();                          // Pausar ejecución (Debug)
await page.screenshot({ path: 'foto.png' }); // Captura de pantalla
```

### Aserciones (Validaciones)

Verificar que el resultado es el esperado.

```javascript
// Verificar URL
await expect(page).toHaveURL(/.*dashboard/);
await expect(page).toHaveURL('https://sitio.com/dashboard');

// Verificar título de página
await expect(page).toHaveTitle('Mi Aplicación');

// Verificar texto visible
await expect(locator).toHaveText('Compra Exitosa');
await expect(locator).toContainText('Bienvenido');

// Verificar estado del elemento
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();

// Verificar atributos
await expect(locator).toHaveAttribute('href', '/home');
await expect(locator).toHaveClass(/active/);

// Verificar cantidad de elementos
await expect(locator).toHaveCount(5);
```

---

## 🔗 6. Pruebas de API

Usando el objeto `request` para validar endpoints directamente.

```javascript
test('API debe responder 200 OK', async ({ request }) => {
  // Hacer petición GET
  const response = await request.get('https://api.example.com/users');
  
  // Validar status
  expect(response.status()).toBe(200);
  
  // Validar body JSON
  const body = await response.json();
  expect(body.length).toBeGreaterThan(0);
  expect(body[0]).toHaveProperty('name');
});

test('Crear usuario via POST', async ({ request }) => {
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'Juan',
      email: 'juan@test.com'
    }
  });
  
  expect(response.status()).toBe(201);
});
```

---

## 🧪 7. Pruebas Unitarias

Validar funciones de lógica pura sin navegador.

```javascript
import { test, expect } from '@playwright/test';
import { calcularTotal, validarEmail } from './utils';

test('Debe calcular el total con impuestos', () => {
  const resultado = calcularTotal(100, 0.21);
  expect(resultado).toBe(121);
});

test('Debe validar formato de email', () => {
  expect(validarEmail('test@mail.com')).toBe(true);
  expect(validarEmail('invalido')).toBe(false);
});
```

---

## ⚙️ 8. Configuración Útil (playwright.config.js)

Opciones comunes para personalizar el comportamiento.

```javascript
// playwright.config.js
const config = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  
  use: {
    baseURL: 'https://mi-app.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
};

module.exports = config;
```

---

## 📁 9. Estructura de Proyecto Recomendada

```
mi-proyecto/
├── tests/
│   ├── e2e/
│   │   ├── login.spec.js
│   │   └── checkout.spec.js
│   ├── api/
│   │   └── usuarios.spec.js
│   └── unit/
│       └── utils.spec.js
├── pages/                    # Page Object Model
│   ├── LoginPage.js
│   └── HomePage.js
├── playwright.config.js
├── package.json
└── README.md
```

---

## 🚀 10. Tips Rápidos

| Situación | Solución |
| :--- | :--- |
| Test falla intermitentemente | Usa `await expect()` en lugar de esperas fijas |
| Necesito ver qué pasa | Agrega `await page.pause()` en el código |
| Selector no funciona | Usa `npx playwright codegen` para generarlo |
| Quiero correr un solo test | Cambia `test()` por `test.only()` |
| Quiero saltar un test | Cambia `test()` por `test.skip()` |
| Login lento en cada test | Usa `storageState` para reutilizar sesión |

---


