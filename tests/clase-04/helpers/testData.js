// @ts-check

/**
 * CLASE 4: Datos de Prueba
 * Centraliza datos usados en los tests.
 */

export const testUsers = {
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
  }
};

export const products = {
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
  boltTShirt: {
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
  redTShirt: {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99
  }
};

export const testCheckoutInfo = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345'
};

export function calculateSubtotal(productIds) {
  return productIds.reduce((sum, id) => {
    const product = Object.values(products).find(p => p.id === id);
    return sum + (product?.price || 0);
  }, 0);
}

export function calculateTax(subtotal, taxRate = 0.08) {
  return Math.round(subtotal * taxRate * 100) / 100;
}

export function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}
