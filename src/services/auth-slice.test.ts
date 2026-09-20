import { describe, expect, it } from 'vitest';

import {
  authReducer,
  checkUserAuth,
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from './auth-slice';

import type { TUser } from '@utils/types';

const user: TUser = {
  email: 'test@example.com',
  name: 'Tester',
};

describe('authReducer', () => {
  it('has the correct initial state', () => {
    expect(authReducer(undefined, { type: '@INIT' })).toEqual(initialState);
  });

  it('sets auth check pending state', () => {
    const nextState = authReducer(undefined, { type: checkUserAuth.pending.type });

    expect(nextState.isAuthChecked).toBe(false);
  });

  it('stores the user after auth check', () => {
    const nextState = authReducer(undefined, {
      type: checkUserAuth.fulfilled.type,
      payload: user,
    });

    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('changes state for registration requests', () => {
    const pendingState = authReducer(undefined, {
      type: registerUser.pending.type,
    });
    expect(pendingState.status).toBe('loading');
    expect(pendingState.error).toBeNull();

    const successState = authReducer(undefined, {
      type: registerUser.fulfilled.type,
      payload: user,
    });
    expect(successState.status).toBe('succeeded');
    expect(successState.user).toEqual(user);
    expect(successState.error).toBeNull();

    const failedState = authReducer(undefined, {
      type: registerUser.rejected.type,
      payload: 'Не удалось зарегистрироваться',
    });
    expect(failedState.status).toBe('failed');
    expect(failedState.error).toBe('Не удалось зарегистрироваться');
  });

  it('changes state for login requests', () => {
    const pendingState = authReducer(undefined, { type: loginUser.pending.type });
    expect(pendingState.status).toBe('loading');

    const successState = authReducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: user,
    });
    expect(successState.status).toBe('succeeded');
    expect(successState.user).toEqual(user);

    const failedState = authReducer(undefined, {
      type: loginUser.rejected.type,
      payload: 'Не удалось войти',
    });
    expect(failedState.status).toBe('failed');
    expect(failedState.error).toBe('Не удалось войти');
  });

  it('clears user after logout', () => {
    const pendingState = authReducer(
      { ...authReducer(undefined, { type: '@INIT' }), user },
      {
        type: logoutUser.pending.type,
      }
    );
    expect(pendingState.status).toBe('loading');

    const successState = authReducer(
      { ...pendingState, user },
      {
        type: logoutUser.fulfilled.type,
      }
    );
    expect(successState.status).toBe('succeeded');
    expect(successState.user).toBeNull();

    const failedState = authReducer(
      { ...successState, user },
      {
        type: logoutUser.rejected.type,
        payload: 'Не удалось выйти',
      }
    );
    expect(failedState.status).toBe('failed');
    expect(failedState.user).toBeNull();
    expect(failedState.error).toBe('Не удалось выйти');
  });

  it('updates the current user profile', () => {
    const pendingState = authReducer(undefined, { type: updateUser.pending.type });
    expect(pendingState.status).toBe('loading');

    const successState = authReducer(undefined, {
      type: updateUser.fulfilled.type,
      payload: user,
    });
    expect(successState.status).toBe('succeeded');
    expect(successState.user).toEqual(user);

    const failedState = authReducer(undefined, {
      type: updateUser.rejected.type,
      payload: 'Не удалось обновить профиль',
    });
    expect(failedState.status).toBe('failed');
    expect(failedState.error).toBe('Не удалось обновить профиль');
  });
});
