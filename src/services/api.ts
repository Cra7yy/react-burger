import { API_DOMAIN } from '@utils/constants';

export const INGREDIENTS_URL = `${API_DOMAIN}/api/ingredients`;
export const ORDERS_URL = `${API_DOMAIN}/api/orders`;

export const requestJson = async (url: string, init?: RequestInit): Promise<unknown> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Запрос завершился с ошибкой: ${response.status}`);
  }

  return response.json() as Promise<unknown>;
};
