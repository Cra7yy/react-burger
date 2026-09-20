import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { INGREDIENTS_URL, requestJson } from './api';

import type { TApiResponse, TIngredient } from '@utils/types';

type TIngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: TIngredientsState = {
  items: [],
  status: 'idle',
  error: null,
};

const isIngredientsResponse = (value: unknown): value is TApiResponse<TIngredient[]> => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const response = value as { success?: unknown; data?: unknown };

  return response.success === true && Array.isArray(response.data);
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_arg, { rejectWithValue }) => {
  try {
    const payload: unknown = await requestJson(INGREDIENTS_URL);

    if (!isIngredientsResponse(payload)) {
      return rejectWithValue('Некорректный ответ сервера');
    }

    return payload.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось загрузить ингредиенты'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
