import type { Locator, Page } from '@playwright/test';

export class ConstructorPage {
  readonly page: Page;
  readonly orderButton: Locator;
  readonly bunDropZone: Locator;
  readonly ingredientDropZone: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    this.bunDropZone = page.locator('div[class*="burger_constructor_item"]').first();
    this.ingredientDropZone = page
      .locator('div[class*="burger_constructor_list"]')
      .first();
  }

  ingredient(name: string): Locator {
    return this.page.locator(`a[aria-label="${name}"]`);
  }

  constructorIngredient(name: string): Locator {
    return this.page.locator('span').filter({ hasText: new RegExp(`^${name}$`) });
  }

  async addIngredient(name: string): Promise<void> {
    const card = this.ingredient(name);
    const dropZone =
      name === 'Краторная булка N-200i' ? this.bunDropZone : this.ingredientDropZone;

    await card.dragTo(dropZone);
  }

  async openIngredient(name: string): Promise<void> {
    await this.ingredient(name).click();
  }

  async closeModal(): Promise<void> {
    await this.page.getByRole('button', { name: 'Закрыть' }).click();
  }
}
