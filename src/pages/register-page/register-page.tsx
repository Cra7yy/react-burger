import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { registerUser } from '@services/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectAuthError, selectAuthStatus } from '@services/selectors';

import type { ChangeEvent, FormEvent, JSX } from 'react';

export const RegisterPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await dispatch(registerUser({ name, email, password }));
  };

  return (
    <section className="auth-page">
      <form className="form-container" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <Input
          name="name"
          placeholder="Имя"
          value={name}
          onChange={handleNameChange}
          extraClass="mb-6"
        />
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
          Зарегистрироваться
        </Button>
        {error && (
          <p className="text text_type_main-default text_color_error">{error}</p>
        )}
      </form>
      <div className="auth-links">
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className="text-link-button">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
};
