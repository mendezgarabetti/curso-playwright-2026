// @ts-check

/**
 * CLASE 4: Page Object Model (POM)
 * ================================
 * CartPage - Representa la página del carrito
 */

export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // LOCATORS
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // ACCIONES

  async removeItem(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // GETTERS

  async getItemCount() {
    return await this.cartItems.count();
  }

  async getAllItemNames() {
    return await this.itemNames.allTextContents();
  }

  async getAllItemPrices() {
    return await this.itemPrices.allTextContents();
  }

  async isCartEmpty() {
    return (await this.cartItems.count()) === 0;
  }
}
