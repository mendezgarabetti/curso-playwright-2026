// @ts-check

/**
 * CLASE 4: Page Object Model (POM)
 * ================================
 * CheckoutPage - Representa las páginas de checkout (3 pasos)
 */

export class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // LOCATORS - Paso 1: Información
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    
    // LOCATORS - Paso 2: Resumen
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    
    // LOCATORS - Paso 3: Confirmación
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // ACCIONES

  async fillInformation({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async fillWithTestData() {
    await this.fillInformation({
      firstName: 'Test',
      lastName: 'User',
      postalCode: '12345'
    });
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async backToHome() {
    await this.backHomeButton.click();
  }

  // GETTERS

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return text?.replace('Item total: ', '') || '';
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return text?.replace('Tax: ', '') || '';
  }

  async getTotal() {
    const text = await this.totalLabel.textContent();
    return text?.replace('Total: ', '') || '';
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async getSuccessMessage() {
    return await this.completeHeader.textContent();
  }

  async isOrderComplete() {
    return await this.completeHeader.isVisible();
  }

  async getCurrentStep() {
    const url = this.page.url();
    if (url.includes('checkout-step-one')) return 'information';
    if (url.includes('checkout-step-two')) return 'overview';
    if (url.includes('checkout-complete')) return 'complete';
    return 'unknown';
  }

  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}
