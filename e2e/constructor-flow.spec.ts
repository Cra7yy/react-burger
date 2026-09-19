import { expect, test } from '@playwright/test';

const INGREDIENTS_RESPONSE = {
  success: true,
  data: [
    {
      _id: 'bun-1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      __v: 0,
    },
    {
      _id: 'main-1',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      __v: 0,
    },
    {
      _id: 'sauce-1',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 10,
      fat: 5,
      carbohydrates: 15,
      calories: 90,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      __v: 0,
    },
  ],
};

test('constructor flow: drag ingredients, create order and modal interactions', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-token');
    localStorage.setItem('refreshToken', 'refresh-token');
  });

  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(INGREDIENTS_RESPONSE),
    });
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Tester',
        },
      }),
    });
  });

  await page.route('**/api/orders', async (route) => {
    const request = route.request();

    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Флюоресцентный бургер',
        order: { number: 12345 },
      }),
    });
  });

  await page.goto('/');

  await expect(page.getByText('Соберите бургер')).toBeVisible();

  const bunCard = page.locator('a[aria-label="Краторная булка N-200i"]');
  const mainCard = page.locator('a[aria-label="Филе Люминесцентного тетраодонтимформа"]');
  const sauceCard = page.locator('a[aria-label="Соус Spicy-X"]');

  const bunDropZone = page.locator('div[class*="burger_constructor_item"]').first();
  const ingredientDropZone = page.locator('div[class*="burger_constructor_list"]').first();

  await expect(bunCard).toBeVisible();
  await expect(mainCard).toBeVisible();
  await expect(sauceCard).toBeVisible();

  await bunCard.dragTo(bunDropZone);
  await mainCard.dragTo(ingredientDropZone);
  await sauceCard.dragTo(ingredientDropZone);

  await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
  await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  await expect(page.locator('span').filter({ hasText: /^Филе Люминесцентного тетраодонтимформа$/ })).toBeVisible();
  await expect(page.locator('span').filter({ hasText: /^Соус Spicy-X$/ })).toBeVisible();

  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
  await expect(orderButton).toBeEnabled();

  const orderRequest = page.waitForRequest(
    (request) => request.method() === 'POST' && request.url().includes('/api/orders')
  );
  await orderButton.click();
  await orderRequest;

  await expect(page.getByText('12345')).toBeVisible();
  await expect(page.getByText('идентификатор заказа')).toBeVisible();
  await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

  await page.getByRole('button', { name: 'Закрыть' }).click();
  await expect(page.getByText('12345')).not.toBeVisible();

  await bunCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
