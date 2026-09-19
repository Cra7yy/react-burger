import { describe, expect, it } from 'vitest';

import {
  clearSelectedIngredient,
  selectIngredient,
  selectedIngredientReducer,
} from './selected-ingredient-slice';

import type { TIngredient } from '@utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'ingredient.png',
  image_large: 'ingredient-large.png',
  image_mobile: 'ingredient-mobile.png',
  __v: 0,
};

describe('selectedIngredientReducer', () => {
  it('has the correct initial state', () => {
    expect(selectedIngredientReducer(undefined, { type: '@INIT' })).toEqual({
      selected: null,
    });
  });

  it('stores selected ingredient', () => {
    const nextState = selectedIngredientReducer(undefined, selectIngredient(ingredient));

    expect(nextState.selected).toEqual(ingredient);
  });

  it('clears the selected ingredient', () => {
    const nextState = selectedIngredientReducer(
      { selected: ingredient },
      clearSelectedIngredient()
    );

    expect(nextState.selected).toBeNull();
  });
});
