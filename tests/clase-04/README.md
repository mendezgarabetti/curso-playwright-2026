# Clase 04: Arquitectura Escalable (Page Object Model)

## 📋 Contenido de esta carpeta

### Page Objects (`pages/`)
| Archivo | Descripción |
|---------|-------------|
| `LoginPage.js` | Page Object para la página de login |
| `InventoryPage.js` | Page Object para la página de productos |
| `CartPage.js` | Page Object para el carrito |
| `CheckoutPage.js` | Page Object para el checkout (3 pasos) |
| `index.js` | Exporta todos los Page Objects |

### Helpers (`helpers/`)
| Archivo | Descripción |
|---------|-------------|
| `testData.js` | Datos de prueba: usuarios, productos, funciones de cálculo |

### Tests y Demos
| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `fixtures.js` | Config | Fixtures personalizados para inyectar Page Objects |
| `01-comparacion-sin-vs-con-pom.spec.js` | Demo | Antes vs después de aplicar POM |
| `02-tests-con-pom.spec.js` | Demo | Suite completa usando Page Objects |
| `03-tests-con-fixtures.spec.js` | Demo | Tests usando fixtures personalizados |
| `ejercicio-refactorizacion.spec.js` | Práctica | 5 tests para refactorizar |


## 🎯 Objetivos de la clase

Al finalizar esta clase, los participantes podrán:

1. **Entender el patrón Page Object Model** y sus beneficios
2. **Crear Page Objects** para encapsular selectores y acciones
3. **Refactorizar tests existentes** para usar POM
4. **Usar fixtures personalizados** para inyectar Page Objects
5. **Organizar un proyecto de tests** de forma profesional

## 🏗️ Estructura de un Page Object

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    
    // LOCATORS: Selectores como propiedades
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  // ACCIONES: Métodos que interactúan con la página
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // GETTERS: Métodos para obtener información
  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}
```

## 🚀 Comandos útiles

```bash
# Ejecutar todos los tests de la clase 4
npx playwright test tests/clase-04 --project=chromium

# Ejecutar solo el ejercicio
npx playwright test ejercicio-refactorizacion --project=chromium

# Ejecutar con modo UI
npx playwright test tests/clase-04 --ui

# Ver el reporte
npx playwright show-report
```

## 📚 Conceptos cubiertos

### Page Object Model (POM)
- **Locators**: Selectores definidos una vez, reutilizados en métodos
- **Acciones**: Métodos que encapsulan interacciones (login, addToCart, etc.)
- **Getters**: Métodos para obtener datos de la página
- **Navegación**: Métodos para moverse entre páginas

### Beneficios de POM
| Sin POM | Con POM |
|---------|---------|
| Selectores repetidos | Selectores centralizados |
| Código duplicado | Métodos reutilizables |
| Difícil de leer | Lee como lenguaje natural |
| Cambio = muchos archivos | Cambio = un archivo |

### Fixtures Personalizados
```javascript
const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  // Los Page Objects se inyectan automáticamente
});
```

### Helpers y Datos de Prueba
- `testUsers`: Credenciales de usuarios de prueba
- `products`: Catálogo de productos con IDs y precios
- `testCheckoutInfo`: Datos de formulario predefinidos
- Funciones de cálculo: `calculateSubtotal()`, `calculateTax()`

## ✏️ Ejercicio

### Refactorización a POM

**Archivo:** `ejercicio-refactorizacion.spec.js`

**Instrucciones:**
1. Abrir el archivo del ejercicio
2. Estudiar los Page Objects en `./pages/`
3. Refactorizar cada test para usar los Page Objects
4. Verificar que todos los tests pasen

**Criterios de éxito:**
- ✅ Todos los tests pasan en verde
- ✅ No hay selectores hardcodeados
- ✅ Se usan métodos de los Page Objects
- ✅ El código es más legible

**Bonus:**
- Usar `test.step()` para organizar flujos
- Usar los fixtures de `fixtures.js`


## 📁 Estructura de proyecto recomendada

```
tests/
├── pages/                    # Page Objects
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── index.js
├── helpers/                  # Utilidades
│   └── testData.js
├── fixtures.js               # Fixtures personalizados
├── auth.spec.js              # Tests de autenticación
├── inventory.spec.js         # Tests de inventario
├── cart.spec.js              # Tests de carrito
├── checkout.spec.js          # Tests de checkout
└── e2e.spec.js               # Tests end-to-end
```

## 📖 Próxima clase

**Día 5: Pruebas Híbridas y Simulación de Red**
- Pruebas de API con Playwright
- Mocking de respuestas de red
- Interceptar y modificar requests
