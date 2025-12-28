# 🎭 Curso de Automation con Playwright

¡Bienvenido al repositorio oficial del curso! Aquí encontrarás todo el material práctico, ejercicios y ejemplos que veremos clase a clase.

## 🚀 Requisitos previos

Antes de empezar, asegúrate de tener instalado en tu computadora:

- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (Editor recomendado)

---

## 🛠️ Guía de Instalación (Paso a paso)

Tus alumnos no necesitan cuenta en GitHub. Solo deben seguir estos 4 pasos en su terminal para tener el entorno listo:

### 1. Clonar el repositorio

Descarga el código fuente a tu computadora:

```bash
git clone https://github.com/mendezgarabetti/curso-playwright-2026.git
```

### 2. Entrar a la carpeta

```bash
cd curso-playwright-2026
```

### 3. Instalar dependencias

Este paso es crucial. Creará la carpeta `node_modules` con todas las librerías necesarias.

```bash
npm install
```

### 4. Instalar navegadores de Playwright

Descarga los binarios necesarios para correr las pruebas (Chromium, Firefox, WebKit).

```bash
npx playwright install
```

---

## 📂 Estructura del Proyecto

El código está organizado para facilitar el aprendizaje:

- `/tests`: Aquí encontrarás los ejercicios divididos por carpetas (`clase01`, `clase02`, etc.)
- `playwright.config.ts`: La configuración global del proyecto
- `CHEATSHEET.md`: Hoja de trucos con comandos útiles

---

## 🏃‍♂️ Cómo ejecutar las pruebas

Para correr todos los tests:

```bash
npx playwright test
```

Para correr solo los de una clase específica (ej: Clase 1):

```bash
npx playwright test tests/clase01
```

Para ver el reporte HTML al finalizar:

```bash
npx playwright show-report
```

---

## 📤 Cómo subir cambios a GitHub

Una vez que hayas modificado archivos, súbelos con los "3 Pasos Sagrados":

```bash
# 1. Preparar
git add .

# 2. Guardar versión
git commit -m "Descripción de los cambios"

# 3. Subir
git push
```

---

