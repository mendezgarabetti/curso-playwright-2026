import { test, expect } from '@playwright/test';
import path from 'path';
import { readTXT, readCSV } from '../../utils/dataReader.js';

const txtUsers = readTXT(path.resolve(process.cwd(), '.data/users.txt'));
const csvUsers = readCSV(path.resolve(process.cwd(), '.data/users.csv'));
const loginUsers = readCSV(path.resolve(process.cwd(), '.data/loginUsers.csv'));

test.describe('API Data Driven - TXT', () => {

  txtUsers.forEach((name) => {
    test(`Buscar usuario: ${name}`, async ({ request }) => {

      const response = await request.get('https://jsonplaceholder.typicode.com/users');

      expect(response.status()).toBe(200);

      const users = await response.json();

      const found = users.some(u => u.name === name);

      expect(found).toBe(true);
    });
  });

});

test.describe('API Data Driven - CSV', () => {

  csvUsers.forEach((user) => {
    test(`Validar email para usuario ${user.username} con pass ${user.password}`, async ({ request }) => {
      const response = await request.get('https://jsonplaceholder.typicode.com/users');
      expect(response.status()).toBe(200);

      const users = await response.json();
      const found = users.find(u => u.username === user.username);

      expect(found, `Usuario ${user.username} no encontrado en API`).toBeDefined();
      expect(found.email).toContain('@');
});
  });
});

test.describe('WEB Data Driven - Login', () => {

  loginUsers.forEach((user) => {

    test(`Login test: ${user.username} con pass ${user.password}`, async ({ page }) => {

      await page.goto('https://the-internet.herokuapp.com/login');

      await page.locator('#username').fill(user.username);
      await page.locator('#password').fill(user.password);
      await page.locator('button[type="submit"]').click();

      const message = page.locator('#flash');

      if (user.expected === 'success') {
        await expect(message).toContainText('You logged into a secure area!');
      } else {
        await expect(message).toContainText('invalid');
      }
    });
  });
});