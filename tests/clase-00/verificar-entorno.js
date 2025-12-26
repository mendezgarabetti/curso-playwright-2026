#!/usr/bin/env node

/**
 * Script de Verificación de Entorno
 * ==================================
 * Ejecutar con: node verificar-entorno.js
 * 
 * Verifica que todas las herramientas necesarias para el curso
 * de Playwright estén instaladas correctamente.
 */

const { execSync } = require('child_process');

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function header(text) {
  console.log(`\n${colors.cyan}${colors.bold}${'═'.repeat(50)}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}  ${text}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}${'═'.repeat(50)}${colors.reset}\n`);
}

function checkCommand(command, name, minVersion = null, optional = false) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    
    // Extraer versión numérica
    const versionMatch = output.match(/(\d+)\.(\d+)\.(\d+)/);
    let version = output;
    let majorVersion = 0;
    
    if (versionMatch) {
      version = versionMatch[0];
      majorVersion = parseInt(versionMatch[1]);
    }
    
    // Verificar versión mínima si se especificó
    if (minVersion && majorVersion < minVersion) {
      log('⚠️ ', `${name}: v${version} (se recomienda v${minVersion} o superior)`, colors.yellow);
      return { success: true, warning: true };
    }
    
    log('✅', `${name}: v${version}`, colors.green);
    return { success: true, warning: false };
    
  } catch (error) {
    if (optional) {
      log('⚠️ ', `${name}: No instalado (opcional)`, colors.yellow);
      return { success: true, warning: true };
    } else {
      log('❌', `${name}: No instalado`, colors.red);
      return { success: false, warning: false };
    }
  }
}

function checkVSCodeExtension(extensionId, name) {
  try {
    const output = execSync('code --list-extensions', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    if (output.toLowerCase().includes(extensionId.toLowerCase())) {
      log('✅', `Extensión ${name}: Instalada`, colors.green);
      return true;
    } else {
      log('⚠️ ', `Extensión ${name}: No instalada`, colors.yellow);
      return false;
    }
  } catch (error) {
    log('⚠️ ', `No se pudo verificar extensiones de VS Code`, colors.yellow);
    return false;
  }
}

// ============================================================================
// INICIO DE VERIFICACIÓN
// ============================================================================

header('VERIFICACIÓN DE ENTORNO - CURSO PLAYWRIGHT');

console.log('Este script verifica que tengas todo listo para el curso.\n');

let allOk = true;
let warnings = [];

// ----------------------------------------------------------------------------
// 1. Node.js
// ----------------------------------------------------------------------------
console.log(`${colors.bold}1. Node.js${colors.reset}`);
const nodeResult = checkCommand('node --version', 'Node.js', 18);
if (!nodeResult.success) {
  allOk = false;
  console.log(`   ${colors.red}→ Instalá Node.js desde: https://nodejs.org${colors.reset}`);
} else if (nodeResult.warning) {
  warnings.push('Actualizar Node.js a v18+');
}

// ----------------------------------------------------------------------------
// 2. npm
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}2. npm (Package Manager)${colors.reset}`);
const npmResult = checkCommand('npm --version', 'npm');
if (!npmResult.success) {
  allOk = false;
  console.log(`   ${colors.red}→ npm viene con Node.js. Reinstalá Node.js${colors.reset}`);
}

// ----------------------------------------------------------------------------
// 3. VS Code
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}3. Visual Studio Code${colors.reset}`);
const vscodeResult = checkCommand('code --version', 'VS Code');
if (!vscodeResult.success) {
  allOk = false;
  console.log(`   ${colors.red}→ Instalá VS Code desde: https://code.visualstudio.com${colors.reset}`);
}

// ----------------------------------------------------------------------------
// 4. Extensiones de VS Code
// ----------------------------------------------------------------------------
if (vscodeResult.success) {
  console.log(`\n${colors.bold}4. Extensiones de VS Code${colors.reset}`);
  
  const playwrightExt = checkVSCodeExtension('ms-playwright.playwright', 'Playwright Test');
  if (!playwrightExt) {
    warnings.push('Instalar extensión Playwright Test para VS Code');
    console.log(`   ${colors.yellow}→ Instalar: code --install-extension ms-playwright.playwright${colors.reset}`);
  }
  
  checkVSCodeExtension('dbaeumer.vscode-eslint', 'ESLint');
  checkVSCodeExtension('esbenp.prettier-vscode', 'Prettier');
}

// ----------------------------------------------------------------------------
// 5. Git (opcional)
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}5. Git (opcional, para CI/CD)${colors.reset}`);
const gitResult = checkCommand('git --version', 'Git', null, true);
if (!gitResult.success || gitResult.warning) {
  warnings.push('Git no instalado (opcional, útil para Clase 6)');
}

// ----------------------------------------------------------------------------
// 6. Conectividad
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}6. Conectividad a Internet${colors.reset}`);
try {
  execSync('node -e "require(\'https\').get(\'https://www.saucedemo.com\')"', { 
    encoding: 'utf8', 
    timeout: 10000,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  log('✅', 'Conexión a SauceDemo: OK', colors.green);
} catch (error) {
  log('⚠️ ', 'No se pudo conectar a SauceDemo', colors.yellow);
  warnings.push('Verificar conexión a internet');
}

// ============================================================================
// RESUMEN
// ============================================================================

header('RESUMEN');

if (allOk && warnings.length === 0) {
  console.log(`${colors.green}${colors.bold}🎉 ¡Todo listo! Estás preparado para la Clase 1.${colors.reset}\n`);
} else if (allOk) {
  console.log(`${colors.yellow}${colors.bold}⚠️  Entorno funcional con algunas advertencias:${colors.reset}\n`);
  warnings.forEach((w, i) => {
    console.log(`   ${i + 1}. ${w}`);
  });
  console.log(`\n${colors.yellow}Podés continuar, pero se recomienda resolver estos puntos.${colors.reset}\n`);
} else {
  console.log(`${colors.red}${colors.bold}❌ Hay problemas que debes resolver antes del curso:${colors.reset}\n`);
  console.log(`   Revisá los mensajes de error arriba e instalá lo faltante.`);
  console.log(`   Si tenés dudas, contactá al instructor.\n`);
}

// Información adicional
console.log(`${colors.cyan}${'─'.repeat(50)}${colors.reset}`);
console.log(`${colors.bold}Próximos pasos:${colors.reset}`);
console.log(`  1. Crear carpeta: mkdir curso-playwright`);
console.log(`  2. En la Clase 1 ejecutaremos: npm init playwright@latest`);
console.log(`${colors.cyan}${'─'.repeat(50)}${colors.reset}\n`);
