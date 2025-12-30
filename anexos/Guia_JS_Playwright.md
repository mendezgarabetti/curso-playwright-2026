# Guía de Estudio: JavaScript Esencial para Playwright

**Versión:** 1.0  
**Enfoque:** Automation Testing / QA  
**Objetivo:** Dominar los conceptos de JS necesarios para crear scripts de prueba robustos.

---

## 1. Declaración de Variables
En el JavaScript moderno (ES6+), evitamos usar `var` debido a problemas de alcance (scope). Usamos `const` y `let`.

### El Concepto
* **`const`**: Para valores que **no cambiarán** durante la ejecución del bloque (inmutables).
* **`let`**: Para valores que **sí cambiarán** (reasignación).

### 🧪 Contexto Playwright
En los tests, la mayoría de tus declaraciones serán `const` porque los selectores y las importaciones de librerías no cambian. Usarás `let` principalmente en bucles o contadores.

```javascript
// ✅ CORRECTO
const loginButton = page.locator('#login-btn'); // El localizador es constante
let intentoActual = 0; // Esto cambiará en un bucle de reintentos

// ❌ EVITAR
var url = 'https://ejemplo.com'; // 'var' es propenso a errores globales
```

---

## 2. Tipos de Datos y Manipulación de Texto

Más allá de números y booleanos, el manejo de Strings es vital para interactuar con selectores dinámicos.

### Template Literals (Backticks `)

Permiten incrustar variables dentro de un string sin usar el operador `+`. Fundamental para selectores.

```javascript
const producto = "iPhone 15";

// Forma antigua (difícil de leer y mantener)
// const selector = "text=" + producto;

// 🧪 Forma moderna (Usada para selectores dinámicos en Playwright)
const selectorDinamico = `text=${producto}`; 
await page.click(selectorDinamico);
```

### Métodos de String Útiles para QA

A menudo extraemos texto de la web que viene "sucio" (con espacios extra o saltos de línea).

* **`.trim()`**: Elimina espacios al inicio y final.
* **`.includes()`**: Verifica si un texto contiene a otro.

```javascript
// Texto extraído de la UI: "   Precio: $500.00   "
const textoUI = await page.locator('.price').innerText();

// Limpieza para Aserción
const precioLimpio = textoUI.trim(); 

if (precioLimpio.includes("500")) {
    console.log("Precio validado correctamente");
}
```

---

## 3. Funciones y Arrow Functions

Playwright utiliza intensivamente las "Funciones Flecha" (`=>`) por su sintaxis concisa y manejo del contexto.

### Diferencia Visual

```javascript
// Función Tradicional
function sumar(a, b) {
    return a + b;
}

// Arrow Function (Sintaxis moderna)
const sumar = (a, b) => a + b;
```

### 🧪 Contexto Playwright

Verás Arrow Functions en cada test que escribas. Son el estándar para definir bloques de prueba.

```javascript
// 'test' recibe un nombre y una arrow function asíncrona
test('Login exitoso', async ({ page }) => {
    // Pasos del test...
});
```

---

## 4. Destructuring (Desestructuración)

Es una técnica para extraer propiedades de un objeto y guardarlas en variables individuales en una sola línea.

### El Concepto

```javascript
const usuario = { nombre: 'Ana', rol: 'Admin' };

// Sin destructuring
const nombre = usuario.nombre;

// Con destructuring (Más limpio)
const { nombre, rol } = usuario;
```

### 🧪 Contexto Playwright (¡Omnipresente!)

Playwright usa esto para inyectar "Fixtures" (herramientas) en tus tests. No tienes que instanciar la página, Playwright te la da ya lista.

```javascript
// Aquí extraemos 'page' y 'request' del contexto del test
test('API Test', async ({ page, request }) => {
    // Usamos 'page' para UI y 'request' para API
});
```

---

## 5. Asincronismo: `async` / `await` (CRÍTICO ⚠️)

**Este es el concepto más importante.** JavaScript es "no bloqueante", pero en pruebas **necesitamos esperar** (ej: esperar a que cargue la página antes de hacer clic).

### La Regla de Oro

Casi todas las acciones de Playwright (`.click`, `.fill`, `.goto`, `.expect`) retornan una **Promesa**. Debes usar `await` para pausar la ejecución hasta que la acción termine.

```javascript
test('Ejemplo de Async', async ({ page }) => {
    // ❌ INCORRECTO: El test intentará llenar el campo antes de cargar la página
    page.goto('https://tienda.com');
    page.fill('#search', 'Laptop');

    // ✅ CORRECTO: Esperamos a que cada acción se complete antes de pasar a la siguiente
    await page.goto('https://tienda.com');
    await page.locator('#search').fill('Laptop');
});
```

---

## 6. Control de Flujo y Manejo de Errores

### Bucles `for...of` vs `forEach`

Para iterar elementos en pruebas asíncronas, **siempre usa `for...of`**. El método `forEach` no respeta el `await` correctamente y puede causar que tus tests fallen aleatoriamente (flaky tests).

```javascript
const enlaces = ['/home', '/contacto', '/precios'];

// 🧪 Validar múltiples URLs secuencialmente
for (const link of enlaces) {
    await page.goto(`https://miweb.com${link}`);
    await expect(page).toHaveTitle(/Bienvenido/);
}
```

### Try / Catch (Úsalo con precaución)

Sirve para manejar errores, pero en QA **generalmente queremos que el test falle** si algo está mal, para que genere un reporte y captura de pantalla.

* **Úsalo solo para:** Limpieza de datos (teardown) o lógica de reintento muy específica (ej: polling de base de datos).
* **No lo uses para:** Esconder errores de aserción.

---

## 7. Estructuras de Datos y JSON

Vital para pruebas de API, mocks y validación de datos masivos.

### Arrays y Métodos

* **`.filter()`**: Crea un nuevo array con elementos que cumplan una condición.
* **`.map()`**: Transforma los elementos de un array.

```javascript
// Lista de precios obtenida de la web (Strings)
const preciosRaw = ["$10", "$20", "$5"];

// 🧪 Convertir a números limpios para validar > 0
const preciosNumeros = preciosRaw.map(p => Number(p.replace('$', '')));
// Resultado: [10, 20, 5]
```

### JSON (JavaScript Object Notation)

Para interactuar con APIs o preparar datos de prueba.

```javascript
const datosUsuario = {
    user: "test_user",
    pass: "123456"
};

// Convertir Objeto a String (para enviar body a una API)
const payload = JSON.stringify(datosUsuario);

// Convertir String a Objeto (al recibir respuesta de API)
const respuestaAPI = await request.get('/users/1');
const jsonResponse = await respuestaAPI.json();
console.log(jsonResponse.email);
```

### Optional Chaining (`?.`)

Evita que el test "explote" con un error fatal si una propiedad anidada no existe. Muy útil en respuestas de API inconsistentes.

```javascript
// Si 'direccion' es undefined, devuelve undefined en lugar de lanzar error
const ciudad = usuario?.direccion?.ciudad;
```

---

## 8. Clases y POO (Page Object Model)

La base para una arquitectura de pruebas escalable. Usaremos Clases para representar páginas web y reutilizar código.

### Estructura Básica (POM)

```javascript
class LoginPage {
    // Constructor: Donde definimos los selectores
    constructor(page) {
        this.page = page; // 'this' vincula la propiedad a la instancia de la clase
        this.userInput = page.locator('#username');
        this.passInput = page.locator('#password');
        this.loginBtn = page.locator('button[type="submit"]');
    }

    // Métodos: Las acciones de negocio que hace el usuario
    async iniciarSesion(user, pass) {
        await this.userInput.fill(user);
        await this.passInput.fill(pass);
        await this.loginBtn.click();
    }
}
```

### Import / Export

Para usar la clase en tus tests, recuerda exportarla.

**En `LoginPage.js`:**

```javascript
module.exports = { LoginPage };
```

**En `login.spec.js`:**

```javascript
const { LoginPage } = require('./pages/LoginPage');

test('Login con POM', async ({ page }) => {
    const login = new LoginPage(page);
    await login.iniciarSesion('admin', '1234');
});
```
