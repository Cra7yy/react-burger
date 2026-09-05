import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  connectOrders,
  disconnectOrders,
  selectOrdersState,
  toOrderCard,
} from '@services/orders-slice';
import { selectIngredients } from '@services/selectors';

import type { JSX } from 'react';

import styles from './profile-order-page.module.css';

export const ProfileOrdersPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);
  const data = useAppSelector((state) => selectOrdersState(state, 'profile'));

  useEffect(() => {
    dispatch(connectOrders('profile'));
    return (): void => {
      dispatch(disconnectOrders('profile'));
    };
  }, [dispatch]);

  const orders = data.orders
    .map((order) => toOrderCard(order, ingredients))
    .filter((order) => order !== null);

  return (
    <>
      <div className={`${styles.container} custom-scroll pr-2`}>
        {data.status !== 'connected' && !orders.length && <Preloader />}
        {data.error && <p className="text text_type_main-default">{data.error}</p>}
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            data={order}
            onClick={(value) =>
              void navigate(`/profile/orders/${value.id}`, {
                state: { backgroundLocation: location },
              })
            }
          />
        ))}
      </div>
      <Outlet />
    </>
  );
};

export const ProfileOrderPage = ProfileOrdersPage;
