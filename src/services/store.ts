import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth-slice';
import { constructorReducer } from './constructor-slice';
import { ingredientsReducer } from './ingredients-slice';
import { orderReducer } from './order-slice';
import { ordersReducer, ordersWsActions } from './orders-slice';
import { selectedIngredientReducer } from './selected-ingredient-slice';
import { socketMiddleware } from './socket-middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    order: orderReducer,
    selectedIngredient: selectedIngredientReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware(ordersWsActions)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
