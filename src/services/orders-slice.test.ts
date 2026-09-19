import { describe, expect, it } from 'vitest';

import {
  clearSelectedOrder,
  ordersConnectionFailed,
  ordersReceived,
  ordersReducer,
  fetchOrderById,
} from './orders-slice';

import type { TOrder, TOrdersResponse } from '@utils/types';

const order: TOrder = {
  _id: 'order-1',
  ingredients: ['bun-1', 'main-1', 'bun-1'],
  name: 'Краторный бургер',
  status: 'done',
  number: 12,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const ordersResponse: TOrdersResponse = {
  success: true,
  orders: [order],
  total: 1,
  totalToday: 1,
};

describe('ordersReducer', () => {
  it('has the correct initial state', () => {
    expect(ordersReducer(undefined, { type: '@INIT' })).toEqual({
      feed: { orders: [], total: 0, totalToday: 0, status: 'idle', error: null },
      profile: { orders: [], total: 0, totalToday: 0, status: 'idle', error: null },
      selected: null,
      selectedStatus: 'idle',
      selectedError: null,
    });
  });

  it('stores feed data on socket message', () => {
    const nextState = ordersReducer(
      undefined,
      ordersReceived({ kind: 'feed', data: ordersResponse })
    );

    expect(nextState.feed.orders).toEqual(ordersResponse.orders);
    expect(nextState.feed.total).toBe(1);
    expect(nextState.feed.totalToday).toBe(1);
    expect(nextState.feed.status).toBe('connected');
    expect(nextState.feed.error).toBeNull();
  });

  it('marks feed as failed when connection fails', () => {
    const nextState = ordersReducer(
      undefined,
      ordersConnectionFailed({ kind: 'feed', error: 'Ошибка сокета' })
    );

    expect(nextState.feed.status).toBe('failed');
    expect(nextState.feed.error).toBe('Ошибка сокета');
  });

  it('clears selected order state', () => {
    const state = {
      feed: { orders: [], total: 0, totalToday: 0, status: 'connected', error: null },
      profile: { orders: [], total: 0, totalToday: 0, status: 'connected', error: null },
      selected: order,
      selectedStatus: 'loading',
      selectedError: 'Не удалось загрузить заказ',
    };

    const nextState = ordersReducer(state, clearSelectedOrder());

    expect(nextState.selected).toBeNull();
    expect(nextState.selectedStatus).toBe('idle');
    expect(nextState.selectedError).toBeNull();
  });

  it('handles pending and fulfilled order fetching', () => {
    const pendingState = ordersReducer(undefined, {
      type: fetchOrderById.pending.type,
      meta: { arg: '1' },
    });
    expect(pendingState.selectedStatus).toBe('loading');
    expect(pendingState.selected).toBeNull();
    expect(pendingState.selectedError).toBeNull();

    const successState = ordersReducer(undefined, {
      type: fetchOrderById.fulfilled.type,
      payload: order,
    });

    expect(successState.selected).toEqual(order);
    expect(successState.selectedStatus).toBe('idle');
  });

  it('handles rejected order fetching', () => {
    const nextState = ordersReducer(undefined, {
      type: fetchOrderById.rejected.type,
      error: { message: 'Заказ не найден' },
    });

    expect(nextState.selectedStatus).toBe('failed');
    expect(nextState.selectedError).toBe('Заказ не найден');
  });
});
