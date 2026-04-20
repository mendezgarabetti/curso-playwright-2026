# Clase 00: Prerrequisitos - Preparación del Entorno

## 🎯 Objetivo

Este documento detalla todo lo que necesitás tener instalado y configurado **ANTES** de comenzar la Clase 1. Seguí estos pasos con anticipación para aprovechar al máximo el tiempo de capacitación.

---

## 📋 Checklist Rápido

Verificá que tenés:

- [ ] **Node.js** versión 18 o superior
- [ ] **Visual Studio Code** instalado
- [ ] **Extensiones de VS Code** recomendadas
- [ ] **Git** instalado (opcional pero recomendado)
- [ ] **Conexión a internet** estable
- [ ] **Permisos de administrador** en tu equipo (para instalar paquetes)

---

## 1. Node.js (Obligatorio)

### ¿Qué es?
Node.js es el entorno de ejecución de JavaScript que permite correr Playwright. Sin Node.js, no podemos usar Playwright.

### ¿Qué versión necesito?
- **Mínimo:** Node.js 18
- **Recomendado:** Node.js 20 LTS (Long Term Support)

### Instalación

#### Windows
1. Ir a [https://nodejs.org](https://nodejs.org)
2. Descargar la versión **LTS** (botón verde de la izquierda)
3. Ejecutar el instalador `.msi`
4. Seguir el asistente (Next, Next, Next...)
5. **Importante:** Marcar la opción "Automatically install necessary tools" si aparece

#### macOS
**Opción A - Instalador:**
1. Ir a [https://nodejs.org](https://nodejs.org)
2. Descargar la versión **LTS** para macOS
3. Ejecutar el instalador `.pkg`

**Opción B - Homebrew (recomendado):**
```bash
brew install node@20
```

#### Linux (Ubuntu/Debian)
```bash
# Actualizar repositorios
sudo apt update

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verificar instalación
Abrí una terminal (CMD, PowerShell, o Terminal) y ejecutá:

```bash
node --version
```

Deberías ver algo como:
```
v20.10.0
```

También verificá npm (viene con Node.js):
```bash
npm --version
```

Deberías ver algo como:
```
10.2.3
```

### ⚠️ Problemas comunes

**"node no se reconoce como comando"**
- Windows: Reiniciá la terminal o la PC
- Verificá que Node.js se agregó al PATH durante la instalación

**Versión muy vieja**
- Si tenés Node.js 16 o anterior, desinstalá y volvé a instalar la versión LTS

---

## 2. Visual Studio Code (Obligatorio)

### ¿Qué es?
VS Code es el editor de código que usaremos durante todo el curso. Es gratuito, liviano y tiene excelente soporte para JavaScript y Playwright.

### Instalación

#### Todas las plataformas
1. Ir a [https://code.visualstudio.com](https://code.visualstudio.com)
2. Descargar el instalador para tu sistema operativo
3. Ejecutar el instalador
4. **Windows:** Marcar "Add to PATH" y "Register Code as editor for supported file types"

### Verificar instalación
```bash
code --version
```

O simplemente abrí VS Code desde el menú de aplicaciones.

---

## 3. Extensión de VS Code (Obligatoria)

### Playwright Test for VS Code
- **ID:** `ms-playwright.playwright`
- **Instalación:** 
  1. Abrí VS Code
  2. Ir a Extensions (Ctrl+Shift+X)
  3. Buscar "Playwright Test for VSCode"
  4. Click en "Install"

**¿Qué hace?**
- Ejecutar tests desde el editor (sin usar terminal)
- Ver resultados inline en el código
- Debugging integrado paso a paso
- **Pick Locator**: seleccionar elementos visualmente
- Explorador de tests con filtros

### Instalación por terminal
```bash
code --install-extension ms-playwright.playwright
```

---

## 4. Git (Opcional pero Recomendado)

### ¿Qué es?
Git es un sistema de control de versiones. Lo usaremos en la Clase 6 para CI/CD con GitHub Actions.

### Instalación

#### Windows
1. Ir a [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Descargar y ejecutar el instalador
3. Usar las opciones por defecto (Next, Next, Next...)

#### macOS
```bash
# Si tenés Xcode Command Line Tools
xcode-select --install

# O con Homebrew
brew install git
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt install git
```

### Verificar instalación
```bash
git --version
```

Deberías ver algo como:
```
git version 2.43.0
```

### Configuración inicial (solo la primera vez)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

---

## 5. Navegadores (Se instalan con Playwright)

**NO necesitás instalar Chrome, Firefox o Safari manualmente.**

Playwright descarga sus propios navegadores optimizados durante la instalación. Esto lo haremos juntos en la Clase 1 con:

```bash
npx playwright install
```

---

## 6. Verificación Final

Ejecutá estos comandos para verificar que todo está listo:

```bash
# 1. Node.js
node --version
# Esperado: v18.x.x o v20.x.x

# 2. npm
npm --version
# Esperado: 9.x.x o 10.x.x

# 3. VS Code
code --version
# Esperado: 1.8x.x o superior

# 4. Git (opcional)
git --version
# Esperado: 2.x.x
```

### Script de verificación (opcional)

Podés crear un archivo `verificar-entorno.js` y ejecutarlo:

```javascript
// verificar-entorno.js
const { execSync } = require('child_process');

console.log('🔍 Verificando entorno...\n');

try {
  const nodeVersion = execSync('node --version').toString().trim();
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  
  if (majorVersion >= 18) {
    console.log(`✅ Node.js: ${nodeVersion}`);
  } else {
    console.log(`⚠️  Node.js: ${nodeVersion} (se recomienda v18 o superior)`);
  }
} catch (e) {
  console.log('❌ Node.js: No instalado');
}

try {
  const npmVersion = execSync('npm --version').toString().trim();
  console.log(`✅ npm: v${npmVersion}`);
} catch (e) {
  console.log('❌ npm: No instalado');
}

try {
  const gitVersion = execSync('git --version').toString().trim();
  console.log(`✅ Git: ${gitVersion}`);
} catch (e) {
  console.log(`⚠️  Git: No instalado (opcional)`);
}

console.log('\n📋 Verificación completada.');
```

Ejecutar con:
```bash
node verificar-entorno.js
```

---

## 7. Estructura de Carpetas Sugerida

Recomendamos crear una carpeta dedicada para el curso:

```
📁 Documentos/
└── 📁 curso-playwright/      ← Crear esta carpeta
    └── (vacía por ahora)
```

En la Clase 1, dentro de esta carpeta ejecutaremos `npm init playwright@latest`.

---

## 8. Recursos Adicionales

### Documentación oficial
- **Playwright:** [https://playwright.dev](https://playwright.dev)
- **Node.js:** [https://nodejs.org/docs](https://nodejs.org/docs)
- **VS Code:** [https://code.visualstudio.com/docs](https://code.visualstudio.com/docs)

### Aplicación de práctica (la usaremos en clase)
- **SauceDemo:** [https://www.saucedemo.com](https://www.saucedemo.com)
  - Usuario: `standard_user`
  - Contraseña: `secret_sauce`

### Si tenés problemas
1. Verificá la versión de Node.js
2. Reiniciá la terminal después de instalar
3. En Windows, ejecutá como Administrador si hay errores de permisos

---


## ✅ ¡Listo!
