import { NavLink, Outlet } from 'react-router-dom';

import { logoutUser } from '@services/auth-slice';
import { useAppDispatch } from '@services/hooks';

import type { JSX } from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    void dispatch(logoutUser());
  };

  return (
    <div className={styles.container}>
      <nav className={`${styles.navigation} mr-15`}>
        <ul className="text text_type_main-medium mb-20">
          <li>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.link_active : styles.link_inactive}`
              }
            >
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.link_active : styles.link_inactive}`
              }
            >
              История заказов
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.logoutButton} text text_type_main-medium text_color_inactive`}
              onClick={handleLogout}
            >
              Выход
            </button>
          </li>
        </ul>
        <div className={`${styles.note} text text_type_main-default`}>
          В этом разделе вы можете изменить свои персональные данные
        </div>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
