import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getAccessToken, getOrderRequest } from './api';

import type { TIngredient, TOrder, TOrderCardUI, TOrdersResponse } from '@utils/types';

type TFeedKind = 'feed' | 'profile';
type TConnectionStatus = 'idle' | 'connecting' | 'connected' | 'failed';

export type TOrdersState = {
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
    status: TConnectionStatus;
    error: string | null;
  };
  profile: {
    orders: TOrder[];
    total: number;
    totalToday: number;
    status: TConnectionStatus;
    error: string | null;
  };
  selected: TOrder | null;
  selectedStatus: 'idle' | 'loading' | 'failed';
  selectedError: string | null;
};

const initialState: TOrdersState = {
  feed: { orders: [], total: 0, totalToday: 0, status: 'idle', error: null },
  profile: { orders: [], total: 0, totalToday: 0, status: 'idle', error: null },
  selected: null,
  selectedStatus: 'idle',
  selectedError: null,
};

const isOrder = (value: unknown): value is TOrder => {
  if (typeof value !== 'object' || value === null) return false;
  const order = value as Partial<TOrder>;
  return (
    typeof order._id === 'string' &&
    Array.isArray(order.ingredients) &&
    order.ingredients.every((id) => typeof id === 'string') &&
    (order.status === 'created' ||
      order.status === 'pending' ||
      order.status === 'done') &&
    typeof order.number === 'number' &&
    typeof order.createdAt === 'string' &&
    typeof order.updatedAt === 'string'
  );
};

const parseOrdersResponse = (value: unknown): TOrdersResponse | null => {
  if (typeof value !== 'object' || value === null) return null;
  const response = value as Partial<TOrdersResponse>;
  if (
    response.success !== true ||
    !Array.isArray(response.orders) ||
    typeof response.total !== 'number' ||
    typeof response.totalToday !== 'number'
  ) {
    return null;
  }
  return {
    success: true,
    orders: response.orders.filter(isOrder),
    total: response.total,
    totalToday: response.totalToday,
  };
};

const isInvalidTokenResponse = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  const response = value as { success?: unknown; message?: unknown };
  return response.success === false && response.message === 'Invalid or missing token';
};

type TSocketConnectionPayload = {
  kind: TFeedKind;
  url: string;
};

export const ordersWsActions = {
  connect: 'orders/connect',
  disconnect: 'orders/disconnect',
  connected: 'orders/socketConnected',
  message: 'orders/socketMessage',
  error: 'orders/socketError',
  closed: 'orders/socketClosed',
} as const;

export const connectOrders = (
  kind: TFeedKind
): { type: string; payload: TSocketConnectionPayload } => {
  const token = kind === 'profile' ? getSocketToken() : null;
  const url =
    kind === 'profile' && token
      ? `${socketUrls[kind]}?token=${token}`
      : socketUrls[kind];
  return { type: ordersWsActions.connect, payload: { kind, url } };
};
export const disconnectOrders = (
  kind: TFeedKind
): { type: string; payload: TSocketConnectionPayload } => {
  const token = kind === 'profile' ? getSocketToken() : null;
  const url =
    kind === 'profile' && token
      ? `${socketUrls[kind]}?token=${token}`
      : socketUrls[kind];
  return { type: ordersWsActions.disconnect, payload: { kind, url } };
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    ordersConnected: (state, action: { payload: TFeedKind }) => {
      state[action.payload].status = 'connected';
      state[action.payload].error = null;
    },
    socketConnected: (state, action: PayloadAction<TSocketConnectionPayload>) => {
      state[action.payload.kind].status = 'connected';
      state[action.payload.kind].error = null;
    },
    socketMessage: (
      state,
      action: PayloadAction<unknown, string, TSocketConnectionPayload>
    ) => {
      const { kind } = action.meta;
      if (isInvalidTokenResponse(action.payload)) {
        state[kind].status = 'failed';
        state[kind].error = 'Сессия истекла. Выполните вход снова.';
        return;
      }
      const data = parseOrdersResponse(action.payload);
      if (!data) {
        state[kind].status = 'failed';
        state[kind].error = 'Сервер вернул некорректные данные';
        return;
      }
      state[kind].orders = data.orders;
      state[kind].total = data.total;
      state[kind].totalToday = data.totalToday;
      state[kind].status = 'connected';
      state[kind].error = null;
    },
    socketError: (
      state,
      action: PayloadAction<string, string, TSocketConnectionPayload>
    ) => {
      state[action.meta.kind].status = 'failed';
      state[action.meta.kind].error = action.payload;
    },
    socketClosed: (state, action: PayloadAction<TSocketConnectionPayload>) => {
      if (state[action.payload.kind].status === 'connected') {
        state[action.payload.kind].status = 'idle';
      }
    },
    ordersReceived: (
      state,
      action: { payload: { kind: TFeedKind; data: TOrdersResponse } }
    ) => {
      const { kind, data } = action.payload;
      state[kind].orders = data.orders;
      state[kind].total = data.total;
      state[kind].totalToday = data.totalToday;
      state[kind].status = 'connected';
      state[kind].error = null;
    },
    ordersConnectionFailed: (
      state,
      action: { payload: { kind: TFeedKind; error: string } }
    ) => {
      state[action.payload.kind].status = 'failed';
      state[action.payload.kind].error = action.payload.error;
    },
    clearSelectedOrder: (state) => {
      state.selected = null;
      state.selectedStatus = 'idle';
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.selected = null;
        state.selectedStatus = 'loading';
        state.selectedError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.selectedStatus = 'idle';
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.selectedError = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const fetchOrderById = createAsyncThunk<TOrder, string>(
  'orders/fetchOrderById',
  async (id) => {
    const response = await getOrderRequest(id);
    const parsedResponse = parseOrdersResponse(response);
    if (parsedResponse?.orders[0]) {
      return parsedResponse.orders[0];
    }

    const order =
      typeof response === 'object' && response !== null && 'order' in response
        ? response.order
        : null;
    if (isOrder(order)) {
      return order;
    }

    throw new Error('Заказ не найден');
  }
);

const socketUrls: Record<TFeedKind, string> = {
  feed: 'wss://new-stellarburgers.education-services.ru/orders/all',
  profile: 'wss://new-stellarburgers.education-services.ru/orders',
};

const getSocketToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  return token.replace(/^Bearer\s+/i, '');
};

export const {
  ordersConnected,
  ordersReceived,
  ordersConnectionFailed,
  clearSelectedOrder,
} = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;

type TOrdersRootState = { orders: TOrdersState };
export type TOrdersFeedState = TOrdersState[TFeedKind];

const selectOrders = (state: TOrdersRootState, kind: TFeedKind): TOrdersFeedState =>
  state.orders[kind];
export const selectOrdersState = (
  state: TOrdersRootState,
  kind: TFeedKind
): TOrdersFeedState => selectOrders(state, kind);
export const selectSelectedOrder = (state: TOrdersRootState): TOrder | null =>
  state.orders.selected;
export const selectSelectedOrderStatus = (
  state: TOrdersRootState
): TOrdersState['selectedStatus'] => state.orders.selectedStatus;
export const selectSelectedOrderError = (state: TOrdersRootState): string | null =>
  state.orders.selectedError;

export const toOrderCard = (
  order: TOrder,
  ingredients: TIngredient[]
): TOrderCardUI | null => {
  const resolvedIngredients = order.ingredients.map((id) =>
    ingredients.find((ingredient) => ingredient._id === id)
  );
  if (resolvedIngredients.some((ingredient) => !ingredient)) return null;
  const name = Array.from(
    new Set(resolvedIngredients.map((ingredient) => ingredient?.name))
  ).join(', ');
  const serverName = order.name?.trim();
  const orderName = serverName ?? `${name} бургер`;

  return {
    id: order._id,
    number: order.number,
    name: orderName,
    status: order.status,
    date: order.createdAt,
    price: resolvedIngredients.reduce(
      (sum, ingredient) => sum + (ingredient?.price ?? 0),
      0
    ),
    ingredients: resolvedIngredients as TIngredient[],
  };
};
