import { configureStore } from '@reduxjs/toolkit';

import { constructorReducer } from './constructor-slice';
import { ingredientsReducer } from './ingredients-slice';
import { orderReducer } from './order-slice';
import { selectedIngredientReducer } from './selected-ingredient-slice';

export const store = configureStore({
  reducer: {
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    order: orderReducer,
    selectedIngredient: selectedIngredientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
