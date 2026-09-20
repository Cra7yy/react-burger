import { test, expect } from '@playwright/test';

test('example', async ({ page }) => {
  await page.routeFromHAR('e2e/fixtures/burger.har', {
    notFound: 'fallback',
  });
  await page.goto('/');
  await expect(page.getByText('Соберите бургер')).toBeVisible();
});
