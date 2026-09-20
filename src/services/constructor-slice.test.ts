import { describe, expect, it } from 'vitest';

import {
  addIngredient,
  constructorReducer,
  initialState,
  moveIngredient,
  removeIngredient,
  setBun,
} from './constructor-slice';
import { createOrder } from './order-slice';

import type { TIngredient } from '@utils/types';

const bun: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус традиционный галактический',
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
};

describe('constructorReducer', () => {
  it('has the correct initial state', () => {
    expect(constructorReducer(undefined, { type: '@INIT' })).toEqual(initialState);
  });

  it('adds bun to constructor', () => {
    const nextState = constructorReducer(undefined, addIngredient(bun));

    expect(nextState.bun).toEqual(bun);
    expect(nextState.ingredients).toEqual([]);
  });

  it('adds main ingredient with uid', () => {
    const nextState = constructorReducer(undefined, addIngredient(sauce));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject(sauce);
    expect(typeof nextState.ingredients[0].uid).toBe('string');
  });

  it('removes ingredient by uid', () => {
    const startState = constructorReducer(undefined, addIngredient(sauce));
    const uid = startState.ingredients[0].uid;

    const nextState = constructorReducer(startState, removeIngredient(uid));

    expect(nextState.ingredients).toEqual([]);
  });

  it('moves ingredient to a new position', () => {
    const initial = {
      bun: null,
      ingredients: [
        { ...sauce, uid: 'first' },
        { ...sauce, uid: 'second' },
        { ...sauce, uid: 'third' },
      ],
    };

    const nextState = constructorReducer(
      initial,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(nextState.ingredients.map((item) => item.uid)).toEqual([
      'second',
      'third',
      'first',
    ]);
  });

  it('replaces current bun using setBun', () => {
    const nextState = constructorReducer({ bun: null, ingredients: [] }, setBun(bun));

    expect(nextState.bun).toEqual(bun);
  });

  it('clears constructor after successful order creation', () => {
    const initialState = {
      bun,
      ingredients: [{ ...sauce, uid: 'sauce-uid' }],
    };

    const nextState = constructorReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: 3456,
    });

    expect(nextState).toEqual({ bun: null, ingredients: [] });
  });
});
