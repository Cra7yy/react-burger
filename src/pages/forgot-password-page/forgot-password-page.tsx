import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPasswordRequest } from '@services/api';
import { RESET_PASSWORD_ACCESS_KEY } from '@utils/constants';

import type { ChangeEvent, FormEvent, JSX } from 'react';

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await forgotPasswordRequest(email);
      localStorage.setItem(RESET_PASSWORD_ACCESS_KEY, 'true');
      await navigate('/reset-password', { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось отправить письмо для восстановления'
      );
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="form-container" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <EmailInput
          name="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={handleEmailChange}
          extraClass="mb-6"
        />
        <Button
          size="medium"
          type="primary"
          htmlType="submit"
          extraClass="mb-20"
          disabled={isLoading}
        >
          Восстановить
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
