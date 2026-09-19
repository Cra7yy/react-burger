import { describe, expect, it } from 'vitest';

import { fetchIngredients, ingredientsReducer } from './ingredients-slice';

import type { TIngredient } from '@utils/types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png',
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
    image: 'sauce.png',
    image_large: 'sauce-large.png',
    image_mobile: 'sauce-mobile.png',
    __v: 0,
  },
];

describe('ingredientsReducer', () => {
  it('has the correct initial state', () => {
    expect(ingredientsReducer(undefined, { type: '@INIT' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('sets loading status when request starts', () => {
    const nextState = ingredientsReducer(undefined, {
      type: fetchIngredients.pending.type,
    });

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  it('stores ingredients after a successful request', () => {
    const nextState = ingredientsReducer(undefined, {
      type: fetchIngredients.fulfilled.type,
      payload: ingredients,
    });

    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toEqual(ingredients);
    expect(nextState.error).toBeNull();
  });

  it('stores error on failed request', () => {
    const nextState = ingredientsReducer(undefined, {
      type: fetchIngredients.rejected.type,
      payload: 'Не удалось загрузить ингредиенты',
    });

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Не удалось загрузить ингредиенты');
  });
});
