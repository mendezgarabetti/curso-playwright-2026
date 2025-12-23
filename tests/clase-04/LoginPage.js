// @ts-check

/**
 * CLASE 4: Page Object Model (POM)
 * ================================
 * LoginPage - Representa la página de login de SauceDemo
 * 
 * Un Page Object encapsula:
 * - Los SELECTORES de la página (locators)
 * - Las ACCIONES que se pueden hacer en la página (métodos)
 * 
 * Beneficios:
 * - Si cambia un selector, solo lo actualizás en UN lugar
 * - Los tests son más legibles (usan métodos descriptivos)
 * - Reutilización de código
 */

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // ═══════════════════════════════════════════════════════════════
    // LOCATORS: Definimos los selectores como propiedades
    // ═══════════════════════════════════════════════════════════════
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
    this.logo = page.locator('.login_logo');
  }

  // ═══════════════════════════════════════════════════════════════
  // ACCIONES: Métodos que realizan acciones en la página
  // ═══════════════════════════════════════════════════════════════

  /**
   * Navega a la página de login
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Realiza el login con las credenciales proporcionadas
   * @param {string} username 
   * @param {string} password 
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Login rápido con usuario estándar
   */
  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  /**
   * Login con usuario bloqueado (para probar errores)
   */
  async loginAsLockedUser() {
    await this.login('locked_out_user', 'secret_sauce');
  }

  /**
   * Login con usuario problemático
   */
  async loginAsProblemUser() {
    await this.login('problem_user', 'secret_sauce');
  }

  /**
   * Cierra el mensaje de error si está visible
   */
  async closeErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      await this.errorCloseButton.click();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // GETTERS: Métodos para obtener información de la página
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene el texto del mensaje de error
   * @returns {Promise<string>}
   */
  async getErrorText() {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Verifica si el mensaje de error está visible
   * @returns {Promise<boolean>}
   */
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Verifica si estamos en la página de login
   * @returns {Promise<boolean>}
   */
  async isOnLoginPage() {
    return await this.loginButton.isVisible();
  }
}

module.exports = { LoginPage };
