import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type TSelectedIngredientState = {
  selected: TIngredient | null;
};

export const initialState: TSelectedIngredientState = {
  selected: null,
};

const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    selectIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selected = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selected = null;
    },
  },
});

export const { clearSelectedIngredient, selectIngredient } =
  selectedIngredientSlice.actions;
export const selectedIngredientReducer = selectedIngredientSlice.reducer;
