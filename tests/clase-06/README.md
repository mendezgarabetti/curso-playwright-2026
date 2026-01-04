# Clase 06: Integración Continua y Ejecución en la Nube

## 📋 Contenido

| Archivo | Descripción |
|---------|-------------|
| `01-multi-browser.spec.js` | Tests en Chrome, Firefox, Safari |
| `02-entornos.spec.js` | Tests multi-entorno (dev, staging, prod) |
| `03-tags-y-grupos.spec.js` | Organización con @smoke, @regression |
| `04-reportes.spec.js` | Reportes y attachments |
| `playwright.config.example.js` | Configuración profesional |
| `.github/workflows/playwright.yml` | GitHub Actions workflow |

## 🎯 Objetivos

1. **Ejecutar tests en múltiples navegadores**
2. **Configurar diferentes entornos**
3. **Organizar tests con tags**
4. **Configurar CI/CD con GitHub Actions**
5. **Generar reportes ejecutivos**

## 🚀 Comandos útiles

```bash
# Por navegador
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Por tag
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @e2e

# Por entorno
TEST_ENV=staging npx playwright test
TEST_ENV=prod npx playwright test

# Reportes
npx playwright show-report
```

## 📚 Configuración Multi-Browser

```javascript
// playwright.config.js
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ]
});
```

## 📚 Configuración Multi-Entorno

```javascript
const ENVIRONMENTS = {
  dev: 'https://dev.example.com',
  staging: 'https://staging.example.com',
  prod: 'https://www.example.com'
};

const ENV = process.env.TEST_ENV || 'prod';
const BASE_URL = ENVIRONMENTS[ENV];
```

## 📚 Tags de Tests

```javascript
test('Login básico @smoke @critical', async ({ page }) => {
  // Test rápido, crítico
});

test('Flujo completo @e2e @slow', async ({ page }) => {
  // Test largo, E2E
});
```

## 📚 GitHub Actions

El workflow `.github/workflows/playwright.yml` ejecuta:
- Tests en paralelo en Chrome, Firefox, Safari
- Tests de smoke como job separado
- Sube reportes como artifacts
- Retiene screenshots/videos en fallos

## 📚 Reportes

```javascript
reporter: [
  ['list'],                    // Consola
  ['html', { open: 'never' }], // HTML
  ['json', { outputFile: 'results.json' }],
  ['junit', { outputFile: 'junit.xml' }]
]
```

## 🔧 Checklist de CI/CD

- [ ] playwright.config.js configurado
- [ ] Tests organizados (smoke, regression, e2e)
- [ ] Workflow de GitHub Actions creado
- [ ] Reportes configurados
- [ ] Screenshots/videos en fallos
- [ ] Variables de entorno configuradas
- [ ] Artifacts subidos

## 📖 Resumen del Curso

| Día | Tema | Conceptos |
|-----|------|-----------|
| 1 | Fundamentos | Pirámide, instalación, selectores |
| 2 | Interacción | Auto-wait, aserciones, formularios |
| 3 | Depuración | Trace Viewer, storage state |
| 4 | Arquitectura | Page Object Model, fixtures |
| 5 | API & Mocking | API testing, intercepción |
| 6 | CI/CD | Multi-browser, entornos, GitHub Actions |
