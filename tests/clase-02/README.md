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
| `ejercicio-01-aserciones.spec.js` | Ejercicio para agregar aserciones | **Práctica** |
| `ejercicio-02-checkout.spec.js` | Ejercicio para completar flujo de checkout | **Práctica** |


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

Playwright espera automáticamente antes de cada acción. No necesitas `sleep()` ni `waitFor()` en la mayoría de casos.

```javascript
// ❌ ANTI-PATRÓN: No hagas esto
await page.waitForTimeout(3000);

// ✅ CORRECTO: Playwright espera automáticamente
await page.locator('[data-test="button"]').click();
```

**Qué verifica Playwright antes de actuar:**
- ¿El elemento es visible?
- ¿Está habilitado (enabled)?
- ¿Está estable (no se está moviendo)?
- ¿Es receptivo a eventos?

### Aserciones

```javascript
import { test, expect } from '@playwright/test';

// Página
await expect(page).toHaveURL(/.*inventory.html/);
await expect(page).toHaveTitle('Swag Labs');

// Visibilidad
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();

// Texto
await expect(locator).toHaveText('Products');
await expect(locator).toContainText('Sauce');

// Valores
await expect(locator).toHaveValue('texto');
await expect(locator).toBeEmpty();

// Cantidad
await expect(locator).toHaveCount(6);

// Atributos
await expect(locator).toHaveAttribute('type', 'text');
await expect(locator).toHaveClass(/active/);

// Negación
await expect(locator).not.toBeVisible();
```

### Soft Assertions

```javascript
// Las soft assertions NO detienen el test si fallan
// Útil para verificar múltiples condiciones

await expect.soft(locator1).toBeVisible();
await expect.soft(locator2).toHaveText('Texto');
await expect.soft(locator3).toHaveCount(6);

// Al final del test, Playwright reporta TODAS las que fallaron
```

### Formularios

```javascript
// Llenar inputs
await page.locator('#input').fill('texto');        // Reemplaza todo
await page.locator('#input').clear();              // Limpia
await page.locator('#input').pressSequentially('texto', { delay: 50 }); // Tipeo lento

// Checkboxes
await page.locator('#checkbox').check();
await page.locator('#checkbox').uncheck();
await page.locator('#checkbox').setChecked(true);

// Dropdowns
await page.locator('select').selectOption('value');
await page.locator('select').selectOption({ label: 'Texto visible' });

// Teclas especiales
await page.locator('#input').press('Enter');
await page.locator('#input').press('Tab');
await page.locator('#input').press('Control+a');
await page.keyboard.press('Escape');
```

### Elementos Dinámicos

```javascript
// Esperar que aparezca
await expect(page.locator('#elemento')).toBeVisible({ timeout: 10000 });

// Diálogos de JavaScript
page.on('dialog', async dialog => {
  await dialog.accept();     // Aceptar
  // await dialog.dismiss(); // Cancelar
  // await dialog.accept('texto'); // Para prompts
});

// Hover
await page.locator('.menu-item').hover();

// iFrames
const frame = page.frameLocator('#iframe');
await frame.locator('#elemento-dentro').click();

// Upload de archivos
await page.locator('input[type="file"]').setInputFiles('archivo.txt');
```

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

## ⚙️ Configuración ES Modules

Este proyecto usa ES Modules. Para habilitarlo:

```json
// package.json
{
  "type": "module"
}
```

```javascript
// Sintaxis de importación
import { test, expect } from '@playwright/test';
```

## 🔗 Sitios usados en los ejemplos

- **SauceDemo**: https://www.saucedemo.com (principal)
- **The Internet**: https://the-internet.herokuapp.com (elementos dinámicos)

## 📖 Próxima clase

**Día 3: Depuración y Eficiencia**
- Trace Viewer en profundidad
- Reutilización de sesiones (auth state)
- Debugging con Inspector
- Taller práctico de debugging
