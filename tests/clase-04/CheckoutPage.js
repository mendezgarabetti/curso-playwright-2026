// @ts-check

/**
 * CheckoutPage - Representa las páginas de checkout de SauceDemo
 * 
 * El checkout tiene 3 pasos:
 * 1. Your Information (formulario de datos)
 * 2. Overview (resumen de compra)
 * 3. Complete (confirmación)
 */

class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // ═══════════════════════════════════════════════════════════════
    // LOCATORS - Step 1: Your Information
    // ═══════════════════════════════════════════════════════════════
    
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    
    // ═══════════════════════════════════════════════════════════════
    // LOCATORS - Step 2: Overview
    // ═══════════════════════════════════════════════════════════════
    
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    
    // ═══════════════════════════════════════════════════════════════
    // LOCATORS - Step 3: Complete
    // ═══════════════════════════════════════════════════════════════
    
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: YOUR INFORMATION
  // ═══════════════════════════════════════════════════════════════

  /**
   * Llena el formulario de información
   * @param {Object} info
   * @param {string} info.firstName
   * @param {string} info.lastName
   * @param {string} info.postalCode
   */
  async fillInformation(info) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  /**
   * Llena el formulario con datos de prueba predeterminados
   */
  async fillWithTestData() {
    await this.fillInformation({
      firstName: 'Test',
      lastName: 'User',
      postalCode: '12345'
    });
  }

  /**
   * Continúa al siguiente paso
   */
  async continue() {
    await this.continueButton.click();
  }

  /**
   * Cancela y vuelve al carrito
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Llena el formulario y continúa en un solo paso
   * @param {Object} info
   */
  async fillAndContinue(info) {
    await this.fillInformation(info);
    await this.continue();
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: OVERVIEW
  // ═══════════════════════════════════════════════════════════════

  /**
   * Finaliza la compra
   */
  async finish() {
    await this.finishButton.click();
  }

  /**
   * Obtiene el subtotal
   * @returns {Promise<string>}
   */
  async getSubtotal() {
    const text = await this.subtotalLabel.textContent() || '';
    // Extrae el valor numérico de "Item total: $XX.XX"
    const match = text.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }

  /**
   * Obtiene el impuesto
   * @returns {Promise<string>}
   */
  async getTax() {
    const text = await this.taxLabel.textContent() || '';
    const match = text.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }

  /**
   * Obtiene el total
   * @returns {Promise<string>}
   */
  async getTotal() {
    const text = await this.totalLabel.textContent() || '';
    const match = text.match(/\$[\d.]+/);
    return match ? match[0] : '';
  }

  /**
   * Obtiene la información de pago
   * @returns {Promise<string>}
   */
  async getPaymentInfo() {
    return await this.paymentInfo.textContent() || '';
  }

  /**
   * Obtiene la información de envío
   * @returns {Promise<string>}
   */
  async getShippingInfo() {
    return await this.shippingInfo.textContent() || '';
  }

  /**
   * Obtiene la cantidad de items en el resumen
   * @returns {Promise<number>}
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: COMPLETE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene el mensaje de éxito
   * @returns {Promise<string>}
   */
  async getSuccessMessage() {
    return await this.completeHeader.textContent() || '';
  }

  /**
   * Obtiene el texto de confirmación
   * @returns {Promise<string>}
   */
  async getConfirmationText() {
    return await this.completeText.textContent() || '';
  }

  /**
   * Vuelve a la página de productos
   */
  async backToProducts() {
    await this.backToProductsButton.click();
  }

  /**
   * Verifica si la compra fue exitosa
   * @returns {Promise<boolean>}
   */
  async isOrderComplete() {
    return await this.completeHeader.isVisible();
  }

  // ═══════════════════════════════════════════════════════════════
  // GETTERS DE ERROR
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene el mensaje de error
   * @returns {Promise<string>}
   */
  async getErrorText() {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Verifica si hay un error visible
   * @returns {Promise<boolean>}
   */
  async hasError() {
    return await this.errorMessage.isVisible();
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS DE UBICACIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Verifica en qué paso del checkout estamos
   * @returns {Promise<'information' | 'overview' | 'complete' | 'unknown'>}
   */
  async getCurrentStep() {
    const url = this.page.url();
    if (url.includes('checkout-step-one')) return 'information';
    if (url.includes('checkout-step-two')) return 'overview';
    if (url.includes('checkout-complete')) return 'complete';
    return 'unknown';
  }
}

module.exports = { CheckoutPage };
