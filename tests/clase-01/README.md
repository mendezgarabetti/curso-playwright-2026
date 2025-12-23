# Clase 01: Estrategia y Cimientos Sólidos

## 📋 Contenido de esta carpeta

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `01-selectores.spec.js` | Demo | Jerarquía de selectores (Nivel 1-4) |
| `02-aserciones.spec.js` | Demo | Aserciones de página, elementos, texto |
| `03-primer-test.spec.js` | Demo | Login básico y casos negativos |
| `04-flujo-e2e.spec.js` | Demo | Flujo de compra completo |
| `05-tests-fragiles.spec.js` | Demo | Wikipedia vs SauceDemo (fragilidad) |
| `ejercicio-primeros-pasos.spec.js` | **Práctica** | Ejercicios para completar |


## 🎯 Objetivos de la clase

Al finalizar esta clase, los participantes podrán:

1. **Entender la Pirámide de Testing** y dónde encaja Playwright
2. **Instalar y configurar** un proyecto de Playwright desde cero
3. **Escribir selectores robustos** usando la jerarquía de calidad
4. **Crear tests básicos** con acciones y aserciones
5. **Identificar tests frágiles** y entender por qué evitarlos

## 🚀 Comandos útiles

```bash
# Ejecutar todas las demos de la clase 1
npx playwright test tests/clase-01 --project=chromium

# Ejecutar solo el ejercicio
npx playwright test ejercicio-primeros-pasos --project=chromium

# Ejecutar en modo UI (interactivo)
npx playwright test tests/clase-01 --ui

# Ejecutar con navegador visible
npx playwright test tests/clase-01 --headed

# Ejecutar un test específico
npx playwright test 01-selectores --project=chromium

# Ver el reporte HTML
npx playwright show-report
```

## 📚 Conceptos cubiertos

### Pirámide de Testing (Cohn)

```
        /\
       /  \    UI/E2E (Playwright) - Lento pero realista
      /----\
     /      \  Integración/API - Medio
    /--------\
   /          \ Unitarias - Rápido pero aislado
  /____________\
```

### Jerarquía de Selectores

| Nivel | Tipo | Ejemplo | Calidad |
|-------|------|---------|---------|
| 🥇 1 | data-test | `[data-test="username"]` | Excelente |
| 🥈 2 | Semántico | `getByRole('button', { name: 'Login' })` | Bueno |
| 🥉 3 | Contenido | `getByText('Agregar')` | Aceptable |
| 💀 4 | Estructural | `.form > div:nth-child(1) > input` | Evitar |

### Aserciones Principales

```javascript
// Página
await expect(page).toHaveURL(/.*inventory.html/);
await expect(page).toHaveTitle('Swag Labs');

// Elementos
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Products');
await expect(locator).toContainText('Sauce');
await expect(locator).toHaveCount(6);
await expect(locator).toHaveAttribute('type', 'text');

// Negaciones
await expect(locator).not.toBeVisible();
```

### Estructura de un Test

```javascript
test('descripción del test', async ({ page }) => {
  // 1. ARRANGE - Preparar
  await page.goto('https://www.saucedemo.com/');
  
  // 2. ACT - Actuar
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="login-button"]').click();
  
  // 3. ASSERT - Verificar
  await expect(page).toHaveURL(/.*inventory.html/);
});
```

## ✏️ Ejercicios

### Ejercicio 1: Login
- Login exitoso con standard_user
- Verificar error con locked_out_user

### Ejercicio 2: Productos
- Verificar cantidad de productos (6)
- Verificar título "Products"
- Agregar producto al carrito
- Agregar y quitar producto

### Ejercicio 3: Carrito
- Navegar al carrito
- Verificar producto en carrito

### Ejercicio 4: BONUS
- Completar flujo de checkout completo



## 🔧 Instalación de Playwright

```bash
# Crear proyecto nuevo
npm init playwright@latest

# Opciones recomendadas:
# - JavaScript (no TypeScript para este curso)
# - tests/ (carpeta por defecto)
# - Sí a GitHub Actions
# - Sí a instalar navegadores

# Verificar instalación
npx playwright test
```

## 📖 Aplicación de práctica

**SauceDemo**: https://www.saucedemo.com

| Usuario | Comportamiento |
|---------|----------------|
| standard_user | Funciona normalmente |
| locked_out_user | Bloqueado |
| problem_user | Tiene bugs visuales |
| performance_user | Lento |
| error_user | Errores aleatorios |
| visual_user | Diferencias visuales |

**Contraseña para todos**: `secret_sauce`

## 📖 Próxima clase

**Día 2: Interacción Inteligente y Validaciones**
- Auto-wait de Playwright
- Aserciones avanzadas
- Formularios y elementos dinámicos
- Happy Path completo
