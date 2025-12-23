// @ts-check

/**
 * InventoryPage - Representa la página de productos de SauceDemo
 * 
 * Esta página es la principal después del login.
 * Contiene la lista de productos y el carrito.
 */

class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // ═══════════════════════════════════════════════════════════════
    // LOCATORS
    // ═══════════════════════════════════════════════════════════════
    
    // Header
    this.title = page.locator('[data-test="title"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    
    // Menu lateral
    this.menuWrap = page.locator('.bm-menu-wrap');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    
    // Productos
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.productDescriptions = page.locator('[data-test="inventory-item-desc"]');
    
    // Ordenamiento
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // ═══════════════════════════════════════════════════════════════
  // NAVEGACIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Navega directamente a la página de inventario
   * Nota: Requiere estar autenticado
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  /**
   * Navega al carrito
   */
  async goToCart() {
    await this.cartLink.click();
  }

  /**
   * Navega a un producto específico por su nombre
   * @param {string} productName
   */
  async goToProduct(productName) {
    await this.page.locator(`[data-test="inventory-item-name"]:has-text("${productName}")`).click();
  }

  // ═══════════════════════════════════════════════════════════════
  // CARRITO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Agrega un producto al carrito por su nombre corto (data-test)
   * Ejemplos: 'sauce-labs-backpack', 'sauce-labs-bike-light'
   * @param {string} productId - El identificador del producto en data-test
   */
  async addToCart(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  /**
   * Remueve un producto del carrito por su nombre corto
   * @param {string} productId
   */
  async removeFromCart(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Agrega múltiples productos al carrito
   * @param {string[]} productIds - Array de identificadores
   */
  async addMultipleToCart(productIds) {
    for (const productId of productIds) {
      await this.addToCart(productId);
    }
  }

  /**
   * Obtiene la cantidad de items en el carrito
   * @returns {Promise<number>}
   */
  async getCartCount() {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return parseInt(text || '0', 10);
    }
    return 0;
  }

  // ═══════════════════════════════════════════════════════════════
  // ORDENAMIENTO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Ordena los productos
   * @param {'az' | 'za' | 'lohi' | 'hilo'} option
   *   - 'az': Name (A to Z)
   *   - 'za': Name (Z to A)
   *   - 'lohi': Price (low to high)
   *   - 'hilo': Price (high to low)
   */
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  // ═══════════════════════════════════════════════════════════════
  // MENÚ LATERAL
  // ═══════════════════════════════════════════════════════════════

  /**
   * Abre el menú hamburguesa
   */
  async openMenu() {
    await this.menuButton.click();
    await this.menuWrap.waitFor({ state: 'visible' });
  }

  /**
   * Cierra el menú hamburguesa
   */
  async closeMenu() {
    await this.closeMenuButton.click();
    await this.menuWrap.waitFor({ state: 'hidden' });
  }

  /**
   * Hace logout
   */
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /**
   * Resetea el estado de la aplicación
   */
  async resetAppState() {
    await this.openMenu();
    await this.resetLink.click();
    await this.closeMenu();
  }

  // ═══════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene el número total de productos
   * @returns {Promise<number>}
   */
  async getProductCount() {
    return await this.productItems.count();
  }

  /**
   * Obtiene todos los nombres de productos
   * @returns {Promise<string[]>}
   */
  async getAllProductNames() {
    return await this.productNames.allTextContents();
  }

  /**
   * Obtiene todos los precios
   * @returns {Promise<string[]>}
   */
  async getAllPrices() {
    return await this.productPrices.allTextContents();
  }

  /**
   * Obtiene el precio del primer producto
   * @returns {Promise<string>}
   */
  async getFirstProductPrice() {
    return await this.productPrices.first().textContent() || '';
  }

  /**
   * Obtiene el nombre del primer producto
   * @returns {Promise<string>}
   */
  async getFirstProductName() {
    return await this.productNames.first().textContent() || '';
  }

  /**
   * Verifica si estamos en la página de inventario
   * @returns {Promise<boolean>}
   */
  async isOnInventoryPage() {
    const url = this.page.url();
    return url.includes('inventory.html');
  }
}

module.exports = { InventoryPage };
