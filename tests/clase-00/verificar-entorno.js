// verificar-entorno.js
import { execSync } from 'child_process';

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