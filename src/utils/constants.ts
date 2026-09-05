export const API_DOMAIN = 'https://new-stellarburgers.education-services.ru';
export const RESET_PASSWORD_ACCESS_KEY = 'reset-password-access';
export const INGREDIENT_MODAL_OPEN_KEY = 'ingredient-modal-open';
export const INGREDIENT_MODAL_BACKGROUND_KEY = 'ingredient-modal-background';
export const PENDING_ORDER_KEY = 'pending-order';
export const ORDERS_ALL_SOCKET_URL =
  'wss://new-stellarburgers.education-services.ru/orders/all';
export const ORDERS_USER_SOCKET_URL =
  'wss://new-stellarburgers.education-services.ru/orders';

export const ORDER_STATUS_TEXT = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
} as const;

export const INGREDIENTS = {
  BUN: 'bun',
  MAIN: 'main',
  SAUCE: 'sauce',
} as const;

export const ORDER_DETAILS_MOCK = {
  number: '034536',
  description: 'идентификатор заказа',
  status: 'Ваш заказ начали готовить',
  waitMessage: 'Дождитесь готовности на орбитальной станции',
} as const;
