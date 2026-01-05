# Guías Rápidas de Instalación por Sistema Operativo

##  Windows

### Paso 1: Node.js
```powershell
# Opción A: Descargar instalador
# Ir a https://nodejs.org y descargar "LTS"

# Opción B: Con winget (Windows 10/11)
winget install OpenJS.NodeJS.LTS
```

### Paso 2: VS Code
```powershell
# Opción A: Descargar instalador
Ir a https://code.visualstudio.com

# Opción B: Con winget
winget install Microsoft.VisualStudioCode
```

### Paso 3: Git (opcional)
```powershell
winget install Git.Git
```

### Paso 4: Extensión Playwright
```powershell
code --install-extension ms-playwright.playwright
```

### Paso 5: Verificar
```powershell
node --version
npm --version
code --version
```

---

##  macOS

### Paso 1: Homebrew (si no lo tenés)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Node.js
```bash
brew install node@20
```

### Paso 3: VS Code
```bash
brew install --cask visual-studio-code
```

### Paso 4: Git (opcional, puede ya estar instalado)
```bash
# Verificar si ya está
git --version

# Si no está:
brew install git
```

### Paso 5: Extensión Playwright
```bash
code --install-extension ms-playwright.playwright
```

### Paso 6: Verificar
```bash
node --version
npm --version
code --version
```

---

##  Linux (Ubuntu/Debian)

### Paso 1: Actualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### Paso 2: Node.js
```bash
# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Paso 3: VS Code
```bash
# Importar clave de Microsoft
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg

# Agregar repositorio
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'

# Instalar
sudo apt update
sudo apt install code
```

### Paso 4: Git
```bash
sudo apt install git
```

### Paso 5: Extensión Playwright
```bash
code --install-extension ms-playwright.playwright
```

### Paso 6: Dependencias adicionales para Playwright
```bash
# Playwright necesitará estas dependencias para los navegadores
# Se instalarán automáticamente con: npx playwright install-deps
```

### Paso 7: Verificar
```bash
node --version
npm --version
code --version
git --version
```

---

##  Linux (Fedora/RHEL)

### Paso 1: Node.js
```bash
sudo dnf install nodejs
```

### Paso 2: VS Code
```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
sudo dnf install code
```

### Paso 3: Git
```bash
sudo dnf install git
```

---

## ✅ Verificación Universal

Después de instalar, ejecutá en cualquier sistema:

```bash
# Crear carpeta de prueba
mkdir test-entorno
cd test-entorno

# Probar npm
npm init -y
npm install @playwright/test


# Limpiar
cd ..
rm -rf test-entorno
```

---
