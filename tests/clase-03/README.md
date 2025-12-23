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
| `taller-debug-ARREGLAR.spec.js` | 🔴 10 tests rotos para arreglar | Práctica |

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
- Configuración: `trace: 'retain-on-failure'` (recomendado)
- Información capturada: screenshots, DOM, network, console
- Cómo abrir: desde reporte HTML o con `show-trace`
- Navegar el timeline paso a paso

### Storage State (Reutilización de Sesiones)
- El problema: login repetido en cada test
- La solución: guardar y reutilizar estado de autenticación
- Configuración en `playwright.config.js`
- Setup global con `dependencies`

### Herramientas de Debug
| Herramienta | Uso | Comando |
|-------------|-----|---------|
| `page.pause()` | Pausa interactiva | Agregar en código |
| `--debug` | Inspector paso a paso | `npx playwright test --debug` |
| `--ui` | Modo visual con timeline | `npx playwright test --ui` |
| `console.log()` | Logs tradicionales | Agregar en código |
| Screenshots | Capturas manuales | `page.screenshot()` |

### Buenas Prácticas
- ✅ Logs estructurados con prefijos
- ✅ Screenshots en puntos clave
- ✅ Verificaciones incrementales
- ✅ Tests aislados e independientes
- ✅ Helper functions para código DRY
- ❌ Evitar sleeps arbitrarios
- ❌ Evitar hardcodear índices

## 🔧 Taller de Depuración

El archivo `taller-debug-ARREGLAR.spec.js` contiene **10 tests rotos** con errores intencionales:

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

### Instrucciones del taller

1. Ejecutar los tests y ver cuáles fallan:
   ```bash
   npx playwright test taller-debug --project=chromium
   ```

2. Para cada test fallido:
   - Usar `--debug` o `--ui` para investigar
   - Leer la pista en el comentario `// PISTA:`
   - Corregir el error
   - Verificar que pasa en verde



## 🔗 Configuración de Storage State

Para usar storage state en producción, agregar a `playwright.config.js`:

```javascript
projects: [
  // Setup project - hace login y guarda estado
  {
    name: 'setup',
    testMatch: /auth\.setup\.js/,
  },
  // Tests que usan el estado guardado
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      storageState: '.auth/user.json',
    },
    dependencies: ['setup'],
  },
]
```

Y agregar a `.gitignore`:
```
.auth/
```

## 📖 Próxima clase

**Día 4: Arquitectura Escalable (Page Object Model)**
- Patrón POM para separar lógica de tests
- Componentes reutilizables
- Refactorización de tests existentes
