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

import styles from './feed-page.module.css';

export const FeedPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);
  const data = useAppSelector((state) => selectOrdersState(state, 'feed'));

  useEffect(() => {
    dispatch(connectOrders('feed'));
    return (): void => {
      dispatch(disconnectOrders('feed'));
    };
  }, [dispatch]);

  const orders = data.orders
    .map((order) => toOrderCard(order, ingredients))
    .filter((order) => order !== null);
  const done = data.orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number)
    .slice(0, 20);
  const pending = data.orders
    .filter((order) => order.status === 'pending')
    .map((order) => order.number)
    .slice(0, 20);

  return (
    <>
      <main className={`${styles.feed} container mt-10`}>
        <h1 className={`${styles.title} text text_type_main-large mb-5`}>
          Лента заказов
        </h1>
        <section className={`${styles.belt} custom-scroll mr-15 pr-2`}>
          {data.status !== 'connected' && !orders.length && <Preloader />}
          {data.error && <p className="text text_type_main-default">{data.error}</p>}
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              data={order}
              onClick={(value) =>
                void navigate(`/feed/${value.id}`, {
                  state: { backgroundLocation: location },
                })
              }
            />
          ))}
        </section>
        <section className={styles.feed_details}>
          <div className={`${styles.line} mb-15`}>
            <div className={`${styles.line_block} mr-9`}>
              <div className="text text_type_main-medium mb-6">Готовы:</div>
              <div className={styles.line_list}>
                {done.map((number) => (
                  <span
                    style={{ color: '#00CCCC' }}
                    className="text text_type_digits-default"
                    key={number}
                  >
                    {number}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.line_block}>
              <div className="text text_type_main-medium mb-6">В работе:</div>
              <div className={styles.line_list}>
                {pending.map((number) => (
                  <span className="text text_type_digits-default" key={number}>
                    {number}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-15">
            <div className="text text_type_main-medium">Выполнено за все время:</div>
            <div className="text text_type_digits-large">{data.total}</div>
          </div>
          <div>
            <div className="text text_type_main-medium">Выполнено за сегодня:</div>
            <div className="text text_type_digits-large">{data.totalToday}</div>
          </div>
        </section>
      </main>
      <Outlet />
    </>
  );
};
