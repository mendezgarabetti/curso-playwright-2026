# 🎭 Instalación mínima

¡Bienvenido al repositorio oficial del curso! Aquí encontrarás todo el material práctico, ejercicios y ejemplos que veremos clase a clase.

---

## 🚀 Requisitos previos

Antes de empezar, asegúrate de tener instalado en tu computadora:

| Requisito | Windows | Linux |
|-----------|---------|-------|
| **Sistema** | Windows 10+ con 6GB RAM mínimo | Ubuntu 20.04+, Debian 11+, Fedora 36+ |
| **Node.js** | [Descargar](https://nodejs.org/) v18+ | Ver instalación abajo |
| **Git** | [Descargar](https://git-scm.com/) | `sudo apt install git` |
| **Editor** | [VS Code](https://code.visualstudio.com/) | [VS Code](https://code.visualstudio.com/) |

---

## 🛠️ Guía de Instalación por Sistema Operativo

Para evitar conflictos con el proyecto creado localmente se recomienda evitar clonar el repositorio e ir descargando los ejercicios de a uno.

---

## 🪟 Windows

### 1. Clonar el repositorio

Sin necesidad de contar con cuenta en GitHub. Solo deben seguir estos pasos en su terminal:

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

### 4. Configurar PowerShell e instalar navegadores

En Windows, abrir **PowerShell** y ejecutar el siguiente comando (permite ejecutar scripts locales sin firma):

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego instalar los navegadores de Playwright:

```bash
npx playwright install
```

---

## 🐧 Linux

### 1. Instalar Node.js (si no lo tenés)

**Opción A - Usando NodeSource (recomendado):**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

```bash
# Fedora
sudo dnf install -y nodejs
```

**Opción B - Usando nvm (Node Version Manager):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
```

Verificar instalación:

```bash
node --version  # Debería mostrar v18+ o v20+
npm --version
```

### 2. Clonar el repositorio

```bash
git clone https://github.com/mendezgarabetti/curso-playwright-2026.git
```

### 3. Entrar a la carpeta

```bash
cd curso-playwright-2026
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Instalar navegadores y dependencias del sistema

Playwright necesita algunas librerías del sistema para los navegadores:

```bash
# Instala navegadores
npx playwright install 
```

Si preferís instalar solo las dependencias del sistema manualmente:

```bash
# Ubuntu/Debian
sudo apt install -y libwoff1 libopus0 libwebpdemux2 libharfbuzz-icu0 \
  libenchant-2-2 libsecret-1-0 libhyphen0 libmanette-0.2-0 libgles2
```

---

## 📂 Estructura del Proyecto

El código está organizado para facilitar el aprendizaje:

```
curso-playwright-2026/
├── tests/
│   ├── clase-01/        # Ejercicios de la clase 1
│   ├── clase-02/        # Ejercicios de la clase 2
│   └── ...
├── playwright.config.ts # Configuración global
└── CHEATSHEET.md        # Hoja de trucos
```

---

## 🏃‍♂️ Cómo ejecutar las pruebas

Estos comandos funcionan igual en **Windows** y **Linux**:

| Acción | Comando |
|--------|---------|
| Correr todos los tests | `npx playwright test` |
| Tests de una clase | `npx playwright test tests/clase-01` |
| Modo visual (headed) | `npx playwright test --headed` |
| Modo interactivo UI | `npx playwright test --ui` |
| Solo en Chromium | `npx playwright test --project=chromium` |
| Ver reporte HTML | `npx playwright show-report` |

---

## 🔧 Solución de problemas comunes

### Windows
- **Error de ejecución de scripts**: Asegúrate de haber ejecutado `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Node no reconocido**: Reiniciar la terminal después de instalar Node.js

### Linux
- **Error de permisos con npm**: Evitar usar `sudo npm install`, configurar npm para instalar globalmente sin sudo:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
  source ~/.bashrc
  ```
- **Navegadores no funcionan**: Ejecutar `npx playwright install --with-deps` para instalar dependencias faltantes
- **Error de display en servidor sin GUI**: Usar modo headless (es el default) o configurar Xvfb

---

## 📚 Recursos adicionales

- [Documentación oficial de Playwright](https://playwright.dev/)
- [Playwright en español](https://playwright.dev/docs/intro)
- [Cheatsheet del curso](./CHEATSHEET.md)