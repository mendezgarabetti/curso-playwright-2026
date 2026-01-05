# Clase 04: Arquitectura Escalable (Page Object Model)

##  Contenido de esta carpeta

### Page Objects (`pages/`)
| Archivo | Descripción |
|---------|-------------|
| `LoginPage.js` | Page Object para la página de login |
| `InventoryPage.js` | Page Object para la página de productos |
| `CartPage.js` | Page Object para el carrito |
| `CheckoutPage.js` | Page Object para el checkout |
| `index.js` | Exporta todos los Page Objects |

### Helpers (`helpers/`)
| Archivo | Descripción |
|---------|-------------|
| `testData.js` | Datos de prueba: usuarios, productos |

### Tests y Demos
| Archivo | Tipo |
|---------|------|
| `fixtures.js` | Fixtures personalizados |
| `01-comparacion-sin-vs-con-pom.spec.js` | Demo: Antes vs Después |
| `02-tests-con-pom.spec.js` | Suite completa con POM |
| `03-tests-con-fixtures.spec.js` | Tests con fixtures |
| `ejercicio-refactorizacion.spec.js` | **Práctica** |

##  Objetivos

1. **Entender el patrón Page Object Model**
2. **Crear Page Objects** para encapsular selectores
3. **Refactorizar tests** para usar POM
4. **Usar fixtures personalizados**

##  Estructura de un Page Object

```javascript
export class LoginPage {
  constructor(page) {
    this.page = page;
    
    // LOCATORS
    this.usernameInput = page.locator('[data-test="username"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  // ACCIONES
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }

  // GETTERS
  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}
```

## 🚀 Comandos útiles

```bash
npx playwright test tests/clase-04 --project=chromium
npx playwright test ejercicio-refactorizacion --project=chromium
npx playwright test tests/clase-04 --ui
```

##  Beneficios de POM

| Sin POM | Con POM |
|---------|---------|
| Selectores repetidos | Selectores centralizados |
| Código duplicado | Métodos reutilizables |
| Difícil de leer | Lee como lenguaje natural |
| Cambio = muchos archivos | Cambio = un archivo |

##  Fixtures Personalizados

```javascript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAsStandardUser();
    await use(page);
  }
});

export { expect };
```

##  Próxima clase

**Día 5: Pruebas Híbridas y Simulación de Red**
