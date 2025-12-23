// @ts-check

/**
 * CLASE 4: Índice de Page Objects
 * ===============================
 * Este archivo exporta todos los Page Objects para facilitar su importación.
 * 
 * Uso:
 * const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('./pages');
 */

const { LoginPage } = require('./LoginPage');
const { InventoryPage } = require('./InventoryPage');
const { CartPage } = require('./CartPage');
const { CheckoutPage } = require('./CheckoutPage');

module.exports = {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage
};
