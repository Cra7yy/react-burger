import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '@services/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectAuthError, selectAuthStatus } from '@services/selectors';

import type { ChangeEvent, FormEvent, JSX } from 'react';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const LoginPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const action = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(action)) {
      const locationState = location.state as TLocationState | null;
      const fromPath = locationState?.from?.pathname ?? '/';
      await navigate(fromPath, { replace: true });
    }
  };

  return (
    <section className="auth-page">
      <form className="form-container" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <EmailInput
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          extraClass="mb-6"
        />
        <PasswordInput
          icon="ShowIcon"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={handlePasswordChange}
          extraClass="mb-6"
        />
        <Button
          size="medium"
          type="primary"
          htmlType="submit"
          extraClass="mb-20"
          disabled={status === 'loading'}
        >
          Войти
        </Button>
        {error && (
          <p className="text text_type_main-default text_color_error">{error}</p>
        )}
      </form>
      <div className="auth-links">
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/register" className="text-link-button">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className="text-link-button">
            Восстановить пароль
          </Link>
        </p>
      </div>
    </section>
  );
};
