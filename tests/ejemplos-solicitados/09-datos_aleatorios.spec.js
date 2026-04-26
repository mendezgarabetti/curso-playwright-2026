import { test, expect } from '@playwright/test';
import { getRandomNumber } from '../../utils/random.js';

test('GET con ID random (usando utils)', async ({ request }) => {

  // 🔹 usar función externa
  const randomId = getRandomNumber(1, 100);

  console.log('🔢 ID usado:', randomId);

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts/${randomId}`
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBe(randomId);
});