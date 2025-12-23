// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * CLASE 6: Configuración Avanzada de Playwright
 * =============================================
 * Este archivo muestra una configuración profesional para:
 * - Múltiples navegadores
 * - Múltiples entornos (dev, staging, prod)
 * - CI/CD
 * - Reportes
 * - Screenshots y videos
 */

// Leer variables de entorno
require('dotenv').config();

/**
 * URLs por entorno
 */
const ENVIRONMENTS = {
  dev: 'https://dev.saucedemo.com',
  staging: 'https://staging.saucedemo.com',
  prod: 'https://www.saucedemo.com',
  local: 'http://localhost:3000'
};

// Obtener entorno de variable de entorno o usar 'prod' por defecto
const ENV = process.env.TEST_ENV || 'prod';
const BASE_URL = ENVIRONMENTS[ENV] || ENVIRONMENTS.prod;

console.log(`🌍 Ejecutando tests en entorno: ${ENV}`);
console.log(`🔗 URL Base: ${BASE_URL}`);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // ═══════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN GENERAL
  // ═══════════════════════════════════════════════════════════════════
  
  // Carpeta donde están los tests
  testDir: './tests',
  
  // Patrón de archivos de test
  testMatch: '**/*.spec.js',
  
  // Ignorar archivos que empiezan con _
  testIgnore: '**/_*.js',
  
  // Timeout global por test (30 segundos)
  timeout: 30000,
  
  // Timeout para expect() (5 segundos)
  expect: {
    timeout: 5000
  },
  
  // Ejecutar tests en paralelo
  fullyParallel: true,
  
  // Fallar el build si hay test.only() en CI
  forbidOnly: !!process.env.CI,
  
  // Reintentos: 0 en local, 2 en CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers: auto en local, 1 en CI (más estable)
  workers: process.env.CI ? 1 : undefined,
  
  // ═══════════════════════════════════════════════════════════════════
  // REPORTES
  // ═══════════════════════════════════════════════════════════════════
  
  reporter: [
    // Reporte en consola (siempre)
    ['list'],
    
    // Reporte HTML (siempre)
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never' // 'always', 'never', 'on-failure'
    }],
    
    // Reporte JSON (para CI)
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    
    // Reporte JUnit (para integración con CI)
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }]
  ],
  
  // ═══════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN COMPARTIDA (use)
  // ═══════════════════════════════════════════════════════════════════
  
  use: {
    // URL base para page.goto('/')
    baseURL: BASE_URL,
    
    // Trace: solo guardar si falla (recomendado para CI)
    trace: 'retain-on-failure',
    
    // Screenshot: solo si falla
    screenshot: 'only-on-failure',
    
    // Video: solo si falla (consume espacio)
    video: 'retain-on-failure',
    
    // Timeout de acciones (click, fill, etc.)
    actionTimeout: 10000,
    
    // Timeout de navegación
    navigationTimeout: 30000,
    
    // Headers extra para todas las requests
    extraHTTPHeaders: {
      'Accept-Language': 'es-AR',
    },
    
    // Ignorar errores HTTPS (útil para entornos de desarrollo)
    ignoreHTTPSErrors: true,
    
    // Viewport por defecto
    viewport: { width: 1280, height: 720 },
    
    // Locale
    locale: 'es-AR',
    
    // Timezone
    timezoneId: 'America/Argentina/Buenos_Aires',
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECTS (Navegadores y Dispositivos)
  // ═══════════════════════════════════════════════════════════════════
  
  projects: [
    // ─────────────────────────────────────────────────────────────────
    // SETUP: Autenticación global
    // ─────────────────────────────────────────────────────────────────
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // ─────────────────────────────────────────────────────────────────
    // NAVEGADORES DE ESCRITORIO
    // ─────────────────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Usar estado de autenticación guardado
        // storageState: '.auth/user.json',
      },
      // dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    // ─────────────────────────────────────────────────────────────────
    // NAVEGADORES MÓVILES
    // ─────────────────────────────────────────────────────────────────
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },

    // ─────────────────────────────────────────────────────────────────
    // TABLETS
    // ─────────────────────────────────────────────────────────────────
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro 11'],
      },
    },

    // ─────────────────────────────────────────────────────────────────
    // BRANDED BROWSERS (Navegadores reales instalados)
    // ─────────────────────────────────────────────────────────────────
    {
      name: 'google-chrome',
      use: { 
        channel: 'chrome',  // Usa Chrome instalado en el sistema
      },
    },

    {
      name: 'microsoft-edge',
      use: { 
        channel: 'msedge',  // Usa Edge instalado en el sistema
      },
    },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // WEB SERVER (opcional)
  // ═══════════════════════════════════════════════════════════════════
  
  /* Descomentar para levantar servidor antes de tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  */

  // ═══════════════════════════════════════════════════════════════════
  // CARPETA DE RESULTADOS
  // ═══════════════════════════════════════════════════════════════════
  
  outputDir: 'test-results/',
});
