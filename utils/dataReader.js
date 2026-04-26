import fs from 'fs';

// TXT → array simple
export function readTXT(path) {
  return fs.readFileSync(path, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean); // 🔥 elimina vacíos
}

// CSV → array de objetos
export function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const [header, ...rows] = content.split('\n').filter(Boolean);
  const keys = header.split(';');

  return rows.map(row => {
    const values = row.split(';'); // ✅ MISMO separador
    const obj = {};

    keys.forEach((key, i) => {
      obj[key.trim()] = values[i]?.trim();
    });

    return obj;
  });
}