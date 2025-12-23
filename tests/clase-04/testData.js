// @ts-check

/**
 * CLASE 4: Helpers y Componentes Reutilizables
 * ============================================
 * Funciones de utilidad que pueden usarse en múltiples tests.
 */

/**
 * Datos de prueba para usuarios
 */
const testUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce'
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce'
  }
};

/**
 * Datos de prueba para información de checkout
 */
const testCheckoutInfo = {
  valid: {
    firstName: 'Test',
    lastName: 'User',
    postalCode: '12345'
  },
  argentina: {
    firstName: 'Juan',
    lastName: 'Pérez',
    postalCode: '5000'
  },
  empty: {
    firstName: '',
    lastName: '',
    postalCode: ''
  }
};

/**
 * Catálogo de productos de SauceDemo
 * Los IDs corresponden a los data-test de los botones add-to-cart
 */
const products = {
  backpack: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99
  },
  bikeLight: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99
  },
  boltTshirt: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99
  },
  fleeceJacket: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99
  },
  onesie: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99
  },
  redTshirt: {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99
  }
};

/**
 * Calcula el subtotal de una lista de productos
 * @param {string[]} productIds - Array de IDs de productos
 * @returns {number} - Subtotal
 */
function calculateSubtotal(productIds) {
  return productIds.reduce((total, id) => {
    const product = Object.values(products).find(p => p.id === id);
    return total + (product ? product.price : 0);
  }, 0);
}

/**
 * Calcula el impuesto (8% en SauceDemo)
 * @param {number} subtotal
 * @returns {number}
 */
function calculateTax(subtotal) {
  return Math.round(subtotal * 0.08 * 100) / 100;
}

/**
 * Calcula el total
 * @param {number} subtotal
 * @returns {number}
 */
function calculateTotal(subtotal) {
  return Math.round((subtotal + calculateTax(subtotal)) * 100) / 100;
}

/**
 * Formatea un número como precio
 * @param {number} amount
 * @returns {string}
 */
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Genera datos aleatorios para checkout
 * @returns {Object}
 */
function generateRandomCheckoutInfo() {
  const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura'];
  const lastNames = ['García', 'Pérez', 'López', 'Martínez', 'González', 'Rodríguez'];
  
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    postalCode: String(Math.floor(Math.random() * 90000) + 10000)
  };
}

/**
 * Espera un tiempo específico (usar con moderación)
 * @param {number} ms - Milisegundos
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Logger con timestamp para debugging
 * @param {string} message
 * @param {string} level - 'info' | 'warn' | 'error'
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📍',
    warn: '⚠️',
    error: '❌'
  }[level] || '📍';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

module.exports = {
  testUsers,
  testCheckoutInfo,
  products,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatPrice,
  generateRandomCheckoutInfo,
  sleep,
  log
};
