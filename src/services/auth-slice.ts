import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  clearAuthTokens,
  getUserRequest,
  hasStoredTokens,
  loginRequest,
  logoutRequest,
  registerRequest,
  updateUserRequest,
} from './api';

import type { TUser } from '@utils/types';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  status: 'idle',
  error: null,
};

export const registerUser = createAsyncThunk<
  TUser,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('auth/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await registerRequest(data);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось зарегистрироваться'
    );
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await loginRequest(data);
    return response.user;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Не удалось войти');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_arg, { rejectWithValue }) => {
    try {
      await logoutRequest();
      clearAuthTokens();
    } catch (error) {
      clearAuthTokens();
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось выйти'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk<TUser | null>(
  'auth/checkUserAuth',
  async () => {
    if (!hasStoredTokens()) {
      return null;
    }

    try {
      const response = await getUserRequest();
      return response.user;
    } catch (_error) {
      clearAuthTokens();
      return null;
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  { email: string; name: string; password: string },
  { rejectValue: string }
>('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserRequest(data);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось обновить профиль'
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось войти';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload ?? 'Не удалось выйти';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось обновить профиль';
      });
  },
});

export const authReducer = authSlice.reducer;
