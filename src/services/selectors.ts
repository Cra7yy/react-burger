import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';
import type { TIngredient } from '@utils/types';

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectAuthUser = (state: RootState): RootState['auth']['user'] =>
  state.auth.user;
export const selectAuthStatus = (state: RootState): RootState['auth']['status'] =>
  state.auth.status;
export const selectAuthError = (state: RootState): string | null => state.auth.error;
export const selectIsAuthChecked = (
  state: RootState
): RootState['auth']['isAuthChecked'] => state.auth.isAuthChecked;
export const selectIngredientsStatus = (
  state: RootState
): RootState['ingredients']['status'] => state.ingredients.status;
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;
export const selectSelectedIngredient = (
  state: RootState
): RootState['selectedIngredient']['selected'] => state.selectedIngredient.selected;
export const selectConstructorBun = (
  state: RootState
): RootState['burgerConstructor']['bun'] => state.burgerConstructor.bun;
export const selectConstructorIngredients = (
  state: RootState
): RootState['burgerConstructor']['ingredients'] =>
  state.burgerConstructor.ingredients ?? [];
export const selectOrderNumber = (state: RootState): number | null => state.order.number;
export const selectOrderStatus = (state: RootState): RootState['order']['status'] =>
  state.order.status;
export const selectOrderError = (state: RootState): string | null => state.order.error;
export const selectOrderModalOpen = (state: RootState): boolean =>
  state.order.isModalOpen;

export const selectIngredientCounts = createSelector(
  [selectIngredients, selectConstructorBun, selectConstructorIngredients],
  (ingredients, bun, constructorIngredients) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    constructorIngredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return ingredients.reduce<Record<string, number>>((acc, ingredient) => {
      acc[ingredient._id] = counts[ingredient._id] ?? 0;
      return acc;
    }, {});
  }
);

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, constructorIngredients) => {
    const ingredientsPrice = constructorIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return ingredientsPrice + (bun ? bun.price * 2 : 0);
  }
);

export const selectOrderIngredientIds = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, constructorIngredients) => {
    if (!bun) {
      return [];
    }

    return [
      bun._id,
      ...constructorIngredients.map((ingredient) => ingredient._id),
      bun._id,
    ];
  }
);
