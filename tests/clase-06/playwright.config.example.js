// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * CLASE 6: Configuración Avanzada de Playwright
 * =============================================
 */

const ENVIRONMENTS = {
  dev: 'https://dev.saucedemo.com',
  staging: 'https://staging.saucedemo.com',
  prod: 'https://www.saucedemo.com',
  local: 'http://localhost:3000'
};

const ENV = process.env.TEST_ENV || 'prod';
const BASE_URL = ENVIRONMENTS[ENV] || ENVIRONMENTS.prod;

export default defineConfig({
  // Carpeta de tests
  testDir: './tests',
  
  // Patrón de archivos
  testMatch: '**/*.spec.js',
  
  // Timeout por test (30 segundos)
  timeout: 30000,
  
  // Timeout para expect (5 segundos)
  expect: {
    timeout: 5000
  },
  
  // Ejecutar en paralelo
  fullyParallel: true,
  
  // Fallar si hay test.only() en CI
  forbidOnly: !!process.env.CI,
  
  // Reintentos: 0 en local, 2 en CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers: auto en local, 1 en CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reportes
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Configuración compartida
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },
  
  // Projects (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
