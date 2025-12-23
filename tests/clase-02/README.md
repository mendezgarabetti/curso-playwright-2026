# Clase 02: Interacción Inteligente y Validaciones

## 📋 Contenido de esta carpeta

| Archivo | Descripción | Tipo |
|---------|-------------|------|
| `01-auto-wait-demo.spec.js` | Demuestra el mecanismo de auto-wait de Playwright | Demo |
| `02-aserciones-catalogo.spec.js` | Catálogo completo de assertions disponibles | Demo |
| `03-soft-assertions.spec.js` | Uso de expect.soft() para múltiples validaciones | Demo |
| `04-formularios.spec.js` | Interacción con inputs, dropdowns, teclas | Demo |
| `05-elementos-dinamicos.spec.js` | Modales, hovers, iframes, checkboxes | Demo |
| `06-happy-path-checkout.spec.js` | Flujo E2E completo con validaciones en cada paso | Demo |
| `ejercicio-01-aserciones.spec.js` | Ejercicio para agregar aserciones | Práctica |
| `ejercicio-02-checkout.spec.js` | Ejercicio para completar flujo de checkout | Práctica |



## 🎯 Objetivos de la clase

Al finalizar esta clase, los participantes podrán:

1. **Entender el auto-wait** de Playwright y cuándo usar esperas explícitas
2. **Usar aserciones efectivamente** para validar estados de la aplicación
3. **Interactuar con formularios** usando los métodos correctos
4. **Manejar elementos dinámicos** como modales, dropdowns y contenido que carga dinámicamente
5. **Diseñar un Happy Path** con validaciones en cada paso

## 🚀 Comandos útiles

```bash
# Ejecutar todos los demos de la clase 2
npx playwright test tests/clase-02 --project=chromium

# Ejecutar un archivo específico
npx playwright test tests/clase-02/01-auto-wait-demo.spec.js

# Ejecutar en modo UI para ver paso a paso
npx playwright test tests/clase-02/06-happy-path --ui

# Ver el reporte después de ejecutar
npx playwright show-report
```

## 📚 Temas cubiertos

### Auto-Wait
- Playwright espera automáticamente antes de cada acción
- Verifica: visible, enabled, stable, receives events
- Anti-patrón: `page.waitForTimeout()` (sleep)

### Aserciones
- `toBeVisible()` / `toBeHidden()`
- `toHaveText()` / `toContainText()`
- `toHaveValue()` / `toBeEmpty()`
- `toHaveURL()` / `toHaveTitle()`
- `toHaveCount()` / `toHaveAttribute()`
- Negación con `.not`
- Soft assertions con `expect.soft()`

### Formularios
- `fill()` vs `type()` vs `pressSequentially()`
- `clear()` para limpiar inputs
- `check()` / `uncheck()` para checkboxes
- `selectOption()` para dropdowns
- Teclas especiales: `Enter`, `Tab`, `Control+A`

### Elementos Dinámicos
- Elementos que aparecen/desaparecen
- Modales y diálogos JS (`page.on('dialog')`)
- Hover con `hover()`
- iFrames con `frameLocator()`

## ✏️ Ejercicios

### Ejercicio 1: Agregar Aserciones
- Abrir `ejercicio-01-aserciones.spec.js`
- Completar los `// TODO` con aserciones
- Mínimo 8 aserciones, 4 tipos diferentes
- Ejecutar y verificar que pasa en verde

### Ejercicio 2: Completar Checkout
- Abrir `ejercicio-02-checkout.spec.js`
- Completar el flujo de compra de 3 productos
- Agregar validaciones en cada paso
- El test debe terminar con "Thank you for your order!"



## 🔗 Sitios usados en los ejemplos

- **SauceDemo**: https://www.saucedemo.com (principal)
- **The Internet**: https://the-internet.herokuapp.com (elementos dinámicos)

## 📖 Próxima clase

**Día 3: Depuración y Eficiencia**
- Trace Viewer en profundidad
- Reutilización de sesiones (auth state)
- Taller de debugging
