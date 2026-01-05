// @ts-check

/**
 * CLASE 4: Page Object Model (POM)
 * InventoryPage - Página de productos
 */

export class InventoryPage {
  constructor(page) {
    this.page = page;
    
    // LOCATORS
    this.title = page.locator('[data-test="title"]');
    this.products = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
  }

  async addToCart(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async removeFromCart(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async addMultipleToCart(productIds) {
    for (const id of productIds) {
      await this.addToCart(id);
    }
  }

  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async clickProduct(productId) {
    await this.page.locator(`[data-test="item-${productId}-title-link"]`).click();
  }

  async getProductCount() {
    return await this.products.count();
  }

  async getCartCount() {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || '0');
    }
    return 0;
  }

  async getAllProductNames() {
    return await this.productNames.allTextContents();
  }

  async getAllProductPrices() {
    return await this.productPrices.allTextContents();
  }

  async getFirstProductPrice() {
    return await this.productPrices.first().textContent();
  }

  async getFirstProductName() {
    return await this.productNames.first().textContent();
  }
}
