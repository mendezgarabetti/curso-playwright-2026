# Clase 06: Integración Continua y Ejecución en la Nube

## 📋 Contenido de esta carpeta

### Configuración
| Archivo | Descripción |
|---------|-------------|
| `playwright.config.example.js` | Configuración avanzada de Playwright |
| `github-actions/playwright.yml` | Workflow completo de GitHub Actions |
| `github-actions/playwright-simple.yml` | Workflow simplificado |

### Tests y Demos
| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `01-multi-browser.spec.js` | Demo | Tests en múltiples navegadores |
| `02-mobile-devices.spec.js` | Demo | Emulación de dispositivos móviles |
| `03-entornos.spec.js` | Demo | Configuración de entornos (dev/staging/prod) |
| `04-reportes.spec.js` | Demo | Generación de reportes y evidencias |
| `05-paralelo-optimizacion.spec.js` | Demo | Ejecución paralela y optimización |
| `ejercicio-final-cicd.spec.js` | Práctica | Suite completa para CI/CD |

## 🎯 Objetivos de la clase

Al finalizar esta clase, los participantes podrán:

1. **Configurar Playwright** para proyectos empresariales
2. **Ejecutar tests en múltiples navegadores** y dispositivos
3. **Implementar CI/CD** con GitHub Actions
4. **Configurar múltiples entornos** (dev, staging, prod)
5. **Generar reportes ejecutivos** para stakeholders

## 🚀 Comandos útiles

```bash
# Ejecutar en navegador específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Ejecutar en todos los navegadores
npx playwright test

# Ejecutar en móvil
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari

# Ejecutar con entorno específico
TEST_ENV=staging npx playwright test
TEST_ENV=prod npx playwright test

# Ver reporte HTML
npx playwright show-report

# Ejecutar con workers específicos
npx playwright test --workers=4
npx playwright test --workers=1  # Secuencial

# Filtrar por nombre
npx playwright test --grep "SMOKE"
npx playwright test --grep "E2E"
```

## 📚 Conceptos cubiertos

### Configuración Avanzada (playwright.config.js)

```javascript
module.exports = defineConfig({
  // General
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reportes
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results.xml' }]
  ],
  
  // Configuración compartida
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // Proyectos (navegadores)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ]
});
```

### GitHub Actions Workflow

```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Dispositivos Móviles

```javascript
// iPhone 12
test.use({ ...devices['iPhone 12'] });

// Pixel 5
test.use({ ...devices['Pixel 5'] });

// iPad Pro
test.use({ ...devices['iPad Pro 11'] });

// Landscape
test.use({ ...devices['iPhone 12 landscape'] });

// Personalizado
test.use({
  viewport: { width: 375, height: 667 },
  hasTouch: true,
  isMobile: true,
});
```

### Múltiples Entornos

```javascript
const ENVIRONMENTS = {
  dev: 'https://dev.example.com',
  staging: 'https://staging.example.com',
  prod: 'https://www.example.com'
};

const ENV = process.env.TEST_ENV || 'prod';
const BASE_URL = ENVIRONMENTS[ENV];
```

## 📊 Estructura de Reportes

### Reporte HTML (recomendado)
- Resumen visual de resultados
- Screenshots de fallos
- Videos de ejecución
- Traces para debugging
- Filtros por estado/navegador

### Reporte JUnit (para CI)
- Compatible con Jenkins, Azure DevOps, etc.
- XML estándar de la industria

### Reporte JSON
- Para procesamiento programático
- Integración con dashboards

## 🔧 Checklist de CI/CD

- [ ] `playwright.config.js` configurado correctamente
- [ ] Tests organizados (smoke, regression, e2e)
- [ ] Workflow de GitHub Actions creado
- [ ] Reportes configurados (HTML + JUnit)
- [ ] Screenshots/videos en caso de fallo
- [ ] Variables de entorno configuradas
- [ ] Secrets de GitHub configurados (si hay API keys)
- [ ] Artifacts subidos (reportes)
- [ ] Notificaciones configuradas (opcional)

## 📖 Cierre del Curso

### Resumen de los 6 días

| Día | Tema | Conceptos clave |
|-----|------|-----------------|
| 1 | Fundamentos | Pirámide de tests, instalación, selectores |
| 2 | Interacción | Auto-wait, aserciones, formularios |
| 3 | Depuración | Trace Viewer, storage state, debugging |
| 4 | Arquitectura | Page Object Model, fixtures |
| 5 | API & Mocking | API testing, intercepción de red |
| 6 | CI/CD | Multi-browser, entornos, GitHub Actions |

