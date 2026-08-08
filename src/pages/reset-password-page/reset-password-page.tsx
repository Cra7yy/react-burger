import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { resetPasswordRequest } from '@services/api';
import { RESET_PASSWORD_ACCESS_KEY } from '@utils/constants';

import type { ChangeEvent, FormEvent, JSX } from 'react';

export const ResetPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const hasAccess = localStorage.getItem(RESET_PASSWORD_ACCESS_KEY) === 'true';
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setToken(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await resetPasswordRequest({ password, token });
      localStorage.removeItem(RESET_PASSWORD_ACCESS_KEY);
      await navigate('/login', { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось сбросить пароль'
      );
      setIsLoading(false);
    }
  };

  if (!hasAccess) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <section className="auth-page">
      <form className="form-container" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <PasswordInput
          icon="ShowIcon"
          name="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={handlePasswordChange}
          extraClass="mb-6"
        />
        <Input
          name="token"
          placeholder="Введите код из письма"
          value={token}
          onChange={handleTokenChange}
          extraClass="mb-6"
        />
        <Button
          size="medium"
          type="primary"
          htmlType="submit"
          extraClass="mb-20"
          disabled={isLoading}
        >
          Сохранить
        </Button>
        {error && (
          <p className="text text_type_main-default text_color_error">{error}</p>
        )}
      </form>
      <div className="auth-links">
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className="text-link-button">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
};
