import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { updateUser } from '@services/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectAuthError, selectAuthStatus, selectAuthUser } from '@services/selectors';

import type { ChangeEvent, FormEvent, JSX } from 'react';

export const ProfileFormPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    setInitialName(user?.name ?? '');
    setInitialEmail(user?.email ?? '');
  }, [user]);

  const isChanged = useMemo(
    () => name !== initialName || email !== initialEmail || password.length > 0,
    [email, initialEmail, initialName, name, password]
  );

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleCancel = (): void => {
    setName(initialName);
    setEmail(initialEmail);
    setPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await dispatch(updateUser({ name, email, password: password || '' }));
  };

  return (
    <form className="profile-form" onSubmit={(event) => void handleSubmit(event)}>
      <Input
        name="name"
        placeholder="Имя"
        value={name}
        onChange={handleNameChange}
        icon="EditIcon"
        extraClass="mb-6"
      />
      <EmailInput
        name="email"
        placeholder="Логин"
        value={email}
        onChange={handleEmailChange}
        isIcon
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
      {isChanged && (
        <div className="profile-actions">
          <Button type="secondary" htmlType="button" onClick={handleCancel}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit" disabled={status === 'loading'}>
            Сохранить
          </Button>
        </div>
      )}
      {error && <p className="text text_type_main-default text_color_error">{error}</p>}
    </form>
  );
};
