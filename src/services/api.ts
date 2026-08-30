import { API_DOMAIN } from '@utils/constants';

import type {
  TAuthResponse,
  TMessageResponse,
  TRefreshTokenResponse,
  TUserResponse,
} from '@utils/types';

export const INGREDIENTS_URL = `${API_DOMAIN}/api/ingredients`;
export const ORDERS_URL = `${API_DOMAIN}/api/orders`;
export const REGISTER_URL = `${API_DOMAIN}/api/auth/register`;
export const LOGIN_URL = `${API_DOMAIN}/api/auth/login`;
export const LOGOUT_URL = `${API_DOMAIN}/api/auth/logout`;
export const TOKEN_URL = `${API_DOMAIN}/api/auth/token`;
export const USER_URL = `${API_DOMAIN}/api/auth/user`;
export const PASSWORD_RESET_URL = `${API_DOMAIN}/api/password-reset`;
export const PASSWORD_RESET_CONFIRM_URL = `${API_DOMAIN}/api/password-reset/reset`;

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type TApiErrorBody = {
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const getErrorMessage = (body: unknown, status: number): string => {
  if (typeof body === 'object' && body !== null) {
    const payload = body as TApiErrorBody;
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      return payload.message;
    }
  }

  return `Запрос завершился с ошибкой: ${status}`;
};

export const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(payload, response.status));
  }

  return payload as T;
};

export const saveAuthTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const hasStoredTokens = (): boolean =>
  Boolean(getAccessToken()) && Boolean(getRefreshToken());

const isJwtError = (error: unknown): boolean =>
  error instanceof ApiError &&
  (error.message === 'jwt expired' ||
    error.message === 'invalid token' ||
    error.message === 'You should be authorised');

export const refreshTokenRequest = async (): Promise<TRefreshTokenResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Отсутствует refresh token');
  }

  const response = await requestJson<TRefreshTokenResponse>(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  saveAuthTokens(response.accessToken, response.refreshToken);
  return response;
};

const withAuthorization = (init?: RequestInit): RequestInit => {
  const accessToken = getAccessToken();
  const headers = new Headers(init?.headers);

  if (accessToken) {
    headers.set('authorization', accessToken);
  }

  return {
    ...init,
    headers,
  };
};

export const fetchWithRefresh = async <T>(
  url: string,
  init?: RequestInit
): Promise<T> => {
  try {
    return await requestJson<T>(url, withAuthorization(init));
  } catch (error) {
    if (!isJwtError(error) || !getRefreshToken()) {
      throw error;
    }

    await refreshTokenRequest();
    return requestJson<T>(url, withAuthorization(init));
  }
};

export const registerRequest = async (data: {
  email: string;
  password: string;
  name: string;
}): Promise<TAuthResponse> => {
  const response = await requestJson<TAuthResponse>(REGISTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  saveAuthTokens(response.accessToken, response.refreshToken);
  return response;
};

export const loginRequest = async (data: {
  email: string;
  password: string;
}): Promise<TAuthResponse> => {
  const response = await requestJson<TAuthResponse>(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  saveAuthTokens(response.accessToken, response.refreshToken);
  return response;
};

export const logoutRequest = async (): Promise<TMessageResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Отсутствует refresh token');
  }

  return requestJson<TMessageResponse>(LOGOUT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });
};

export const getUserRequest = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(USER_URL, {
    method: 'GET',
  });

export const updateUserRequest = (data: {
  email: string;
  name: string;
  password: string;
}): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(USER_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

export const forgotPasswordRequest = (email: string): Promise<TMessageResponse> =>
  requestJson<TMessageResponse>(PASSWORD_RESET_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

export const resetPasswordRequest = (data: {
  password: string;
  token: string;
}): Promise<TMessageResponse> =>
  requestJson<TMessageResponse>(PASSWORD_RESET_CONFIRM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
