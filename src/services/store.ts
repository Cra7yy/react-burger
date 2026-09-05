import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth-slice';
import { constructorReducer } from './constructor-slice';
import { ingredientsReducer } from './ingredients-slice';
import { orderReducer } from './order-slice';
import { ordersMiddleware, ordersReducer } from './orders-slice';
import { selectedIngredientReducer } from './selected-ingredient-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    order: orderReducer,
    selectedIngredient: selectedIngredientReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ordersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
