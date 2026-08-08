import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ORDERS_URL, fetchWithRefresh } from './api';
import { selectOrderIngredientIds } from './selectors';

import type { RootState } from './store';
import type { TOrderResponse } from '@utils/types';

type TOrderState = {
  number: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isModalOpen: boolean;
};

const initialState: TOrderState = {
  number: null,
  status: 'idle',
  error: null,
  isModalOpen: false,
};

const isOrderResponse = (value: unknown): value is TOrderResponse => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const response = value as {
    success?: unknown;
    order?: { number?: unknown };
  };

  return response.success === true && typeof response.order?.number === 'number';
};

export const createOrder = createAsyncThunk<
  number,
  void,
  { state: RootState; rejectValue: string }
>('order/createOrder', async (_arg, { getState, rejectWithValue }) => {
  const state = getState();
  const ingredients = selectOrderIngredientIds(state);

  if (ingredients.length === 0) {
    return rejectWithValue('Выберите булку для заказа');
  }

  try {
    const payload: unknown = await fetchWithRefresh(ORDERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!isOrderResponse(payload)) {
      return rejectWithValue('Некорректный ответ сервера');
    }

    return payload.order.number;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось создать заказ'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.isModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.number = null;
        state.isModalOpen = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.number = action.payload;
        state.error = null;
        state.isModalOpen = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось создать заказ';
        state.isModalOpen = true;
      });
  },
});

export const { closeOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
