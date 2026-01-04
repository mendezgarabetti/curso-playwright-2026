// @ts-check

/**
 * CLASE 4: Page Object Model (POM)
 * ================================
 * LoginPage - Representa la página de login de SauceDemo
 */

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // LOCATORS
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
    this.logo = page.locator('.login_logo');
  }

  // ACCIONES

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  async loginAsLockedUser() {
    await this.login('locked_out_user', 'secret_sauce');
  }

  async loginAsProblemUser() {
    await this.login('problem_user', 'secret_sauce');
  }

  async closeError() {
    await this.errorCloseButton.click();
  }

  // GETTERS

  async getErrorText() {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}
