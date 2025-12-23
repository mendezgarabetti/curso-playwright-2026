// @ts-check

/**
 * CartPage - Representa la página del carrito de SauceDemo
 */

class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // ═══════════════════════════════════════════════════════════════
    // LOCATORS
    // ═══════════════════════════════════════════════════════════════
    
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    
    // Botones
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // ═══════════════════════════════════════════════════════════════
  // NAVEGACIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Navega directamente al carrito
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  /**
   * Continúa al checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Vuelve a comprar
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // ═══════════════════════════════════════════════════════════════
  // ACCIONES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Remueve un producto del carrito por su nombre corto
   * @param {string} productId
   */
  async removeItem(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Remueve todos los items del carrito
   */
  async removeAllItems() {
    const removeButtons = this.page.locator('button[data-test^="remove-"]');
    const count = await removeButtons.count();
    
    // Remover de atrás hacia adelante para evitar problemas con índices
    for (let i = count - 1; i >= 0; i--) {
      await removeButtons.nth(i).click();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene la cantidad de items en el carrito
   * @returns {Promise<number>}
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Obtiene todos los nombres de productos en el carrito
   * @returns {Promise<string[]>}
   */
  async getAllItemNames() {
    return await this.itemNames.allTextContents();
  }

  /**
   * Obtiene todos los precios en el carrito
   * @returns {Promise<string[]>}
   */
  async getAllPrices() {
    return await this.itemPrices.allTextContents();
  }

  /**
   * Verifica si un producto específico está en el carrito
   * @param {string} productName
   * @returns {Promise<boolean>}
   */
  async hasProduct(productName) {
    const names = await this.getAllItemNames();
    return names.some(name => name.includes(productName));
  }

  /**
   * Verifica si el carrito está vacío
   * @returns {Promise<boolean>}
   */
  async isEmpty() {
    return (await this.getItemCount()) === 0;
  }

  /**
   * Verifica si estamos en la página del carrito
   * @returns {Promise<boolean>}
   */
  async isOnCartPage() {
    const url = this.page.url();
    return url.includes('cart.html');
  }
}

module.exports = { CartPage };
