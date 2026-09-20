import { expect, test } from '@playwright/test';

import { ConstructorPage } from './pages/constructor-page';

test('constructor flow: drag ingredients, create order and modal interactions', async ({
  page,
}) => {
  await page.routeFromHAR('e2e/fixtures/burger.har', {
    notFound: 'fallback',
  });
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-token');
    localStorage.setItem('refreshToken', 'refresh-token');
  });

  const constructorPage = new ConstructorPage(page);
  await page.goto('/');

  await expect(page.getByText('Соберите бургер')).toBeVisible();
  await expect(constructorPage.ingredient('Краторная булка N-200i')).toBeVisible();
  await expect(
    constructorPage.ingredient('Филе Люминесцентного тетраодонтимформа')
  ).toBeVisible();
  await expect(constructorPage.ingredient('Соус Spicy-X')).toBeVisible();

  await constructorPage.addIngredient('Краторная булка N-200i');
  await constructorPage.addIngredient('Филе Люминесцентного тетраодонтимформа');
  await constructorPage.addIngredient('Соус Spicy-X');

  await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
  await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  await expect(
    constructorPage.constructorIngredient('Филе Люминесцентного тетраодонтимформа')
  ).toBeVisible();
  await expect(constructorPage.constructorIngredient('Соус Spicy-X')).toBeVisible();
  await expect(constructorPage.orderButton).toBeEnabled();

  const orderRequest = page.waitForRequest(
    (request) => request.method() === 'POST' && request.url().includes('/api/orders')
  );
  await constructorPage.orderButton.click();
  await orderRequest;

  await expect(page.getByText('12345')).toBeVisible();
  await expect(page.getByText('идентификатор заказа')).toBeVisible();
  await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

  await constructorPage.closeModal();
  await expect(page.getByText('12345')).not.toBeVisible();

  await constructorPage.openIngredient('Краторная булка N-200i');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
  await constructorPage.closeModal();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
