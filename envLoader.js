import fs from 'fs';
import path from 'path';

export function loadEnv() {
  const envName = process.env.ENV || 'dev';
  const filePath = path.resolve(`.env/${envName}.env`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe el archivo de entorno: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  content.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });

  console.log(`🌎 Entorno cargado: ${envName}`);
}