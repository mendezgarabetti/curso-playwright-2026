# Clase 03: Depuración y Eficiencia

## 📋 Contenido de esta carpeta

| Archivo | Descripción | Tipo |
|---------|-------------|------|
| `01-trace-viewer-demo.spec.js` | Demostración del Trace Viewer | Demo |
| `02-storage-state-concepto.spec.js` | Concepto de reutilización de sesiones | Demo |
| `auth.setup.js` | Archivo de setup para autenticación global | Setup |
| `03-tests-con-sesion.spec.js` | Tests que usan sesión reutilizada | Demo |
| `04-debug-tools.spec.js` | Herramientas: pause, console.log, screenshots | Demo |
| `05-buenas-practicas.spec.js` | Patrones y anti-patrones de debugging | Demo |
| `taller-debug-ARREGLAR.spec.js` | 🔴 10 tests rotos para arreglar | **Práctica** |

## 🎯 Objetivos de la clase

Al finalizar esta clase, los participantes podrán:

1. **Usar el Trace Viewer** para análisis forense de tests fallidos
2. **Implementar storage state** para reutilizar sesiones y acelerar tests
3. **Aplicar técnicas de debugging** (pause, logs, screenshots)
4. **Identificar y corregir** errores comunes en tests
5. **Seguir buenas prácticas** para tests mantenibles

## 🚀 Comandos útiles

```bash
# Ejecutar con trace habilitado
npx playwright test --trace on

# Ver un trace específico
npx playwright show-trace test-results/xxx/trace.zip

# Ejecutar con el inspector (modo debug)
npx playwright test --debug

# Ejecutar en modo UI (más visual)
npx playwright test --ui

# Ver el reporte HTML
npx playwright show-report

# Ejecutar solo el taller
npx playwright test taller-debug --project=chromium
```

## 📚 Temas cubiertos

### Trace Viewer

```javascript
// Configuración en playwright.config.js
export default defineConfig({
  use: {
    trace: 'retain-on-failure', // RECOMENDADO
    // trace: 'on',             // Siempre
    // trace: 'off',            // Nunca
  }
});
```

**Información capturada:**
- Screenshots en cada paso
- Estado del DOM
- Requests/Responses de red
- Logs de consola
- Tiempo de cada acción

### Storage State (Reutilización de Sesiones)

```javascript
// auth.setup.js - Se ejecuta una vez
import { test as setup } from '@playwright/test';

setup('login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#user', 'admin');
  await page.fill('#pass', 'secret');
  await page.click('button[type="submit"]');
  
  // Guardar estado
  await page.context().storageState({ path: '.auth/user.json' });
});
```

```javascript
// playwright.config.js
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.js/ },
    { 
      name: 'chromium',
      use: { storageState: '.auth/user.json' },
      dependencies: ['setup']
    }
  ]
});
```

### Herramientas de Debug

| Herramienta | Uso | Comando |
|-------------|-----|---------|
| `page.pause()` | Pausa interactiva | Agregar en código |
| `--debug` | Inspector paso a paso | `npx playwright test --debug` |
| `--ui` | Modo visual con timeline | `npx playwright test --ui` |
| `console.log()` | Logs tradicionales | Agregar en código |
| Screenshots | Capturas manuales | `page.screenshot()` |

### Buenas Prácticas

```javascript
// ✅ Logs estructurados
console.log('🚀 [TEST START] Login');
console.log('📍 [NAV] Página cargada');
console.log('✅ [ASSERT] Verificación OK');

// ✅ Screenshots en puntos clave
await page.screenshot({ path: 'debug/paso-1.png' });

// ✅ Verificaciones incrementales
await expect(input).toHaveValue('texto');

// ❌ Evitar sleeps
// await page.waitForTimeout(3000);

// ❌ Evitar índices hardcodeados
// await items.nth(2).click();
```

## 🔧 Taller de Depuración

El archivo `taller-debug-ARREGLAR.spec.js` contiene **10 tests rotos**:

1. **Selector incorrecto** - typo en data-test
2. **Aserción incorrecta** - cantidad equivocada
3. **Falta await** - condición de carrera
4. **Orden incorrecto** - checkout sin producto
5. **Texto exacto vs parcial** - toHaveText vs toContainText
6. **Timeout muy corto** - 100ms insuficiente
7. **Elemento equivocado** - click en badge vs link
8. **Condición de carrera** - verificar antes de acción
9. **URL mal escrita** - typo en dominio
10. **Lógica incorrecta** - badge vacío no existe

### Instrucciones

```bash
# 1. Ejecutar y ver fallos
npx playwright test taller-debug --project=chromium

# 2. Investigar con debug
npx playwright test taller-debug --debug

# 3. Arreglar cada test

# 4. Verificar que pasan
npx playwright test taller-debug
```

## ⚙️ Configuración ES Modules

```json
// package.json
{ "type": "module" }
```

```javascript
// Imports
import { test, expect } from '@playwright/test';
import path from 'path';
```

## 📖 Próxima clase

**Día 4: Arquitectura Escalable (Page Object Model)**
- Patrón POM para separar lógica de tests
- Componentes reutilizables
- Fixtures personalizados
