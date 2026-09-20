import { describe, expect, it } from 'vitest';

import { closeOrderModal, createOrder, initialState, orderReducer } from './order-slice';

describe('orderReducer', () => {
  it('has the correct initial state', () => {
    expect(orderReducer(undefined, { type: '@INIT' })).toEqual(initialState);
  });

  it('closes the order modal', () => {
    const nextState = orderReducer(
      { number: 123, status: 'succeeded', error: null, isModalOpen: true },
      closeOrderModal()
    );

    expect(nextState.isModalOpen).toBe(false);
  });

  it('sets loading state before order creation', () => {
    const nextState = orderReducer(undefined, { type: createOrder.pending.type });

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
    expect(nextState.number).toBeNull();
    expect(nextState.isModalOpen).toBe(true);
  });

  it('stores order number on success', () => {
    const nextState = orderReducer(undefined, {
      type: createOrder.fulfilled.type,
      payload: 3456,
    });

    expect(nextState.status).toBe('succeeded');
    expect(nextState.number).toBe(3456);
    expect(nextState.error).toBeNull();
    expect(nextState.isModalOpen).toBe(true);
  });

  it('stores error on failed order creation', () => {
    const nextState = orderReducer(undefined, {
      type: createOrder.rejected.type,
      payload: 'Выберите булку для заказа',
    });

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Выберите булку для заказа');
    expect(nextState.isModalOpen).toBe(true);
  });
});
