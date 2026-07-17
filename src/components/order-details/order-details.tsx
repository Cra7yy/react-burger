import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';
import {
  selectOrderError,
  selectOrderNumber,
  selectOrderStatus,
} from '@services/selectors';
import { ORDER_DETAILS_MOCK } from '@utils/constants';

import type { JSX } from 'react';

import styles from './order-details.module.css';

type TOrderDetailsProps = Record<string, never>;

export const OrderDetails = (_props: TOrderDetailsProps): JSX.Element => {
  const number = useAppSelector(selectOrderNumber);
  const status = useAppSelector(selectOrderStatus);
  const error = useAppSelector(selectOrderError);
  const { description, status: statusText, waitMessage } = ORDER_DETAILS_MOCK;

  if (status === 'failed') {
    return (
      <div className={styles.details}>
        <p className="text text_type_main-medium mb-4">Не удалось создать заказ</p>
        <p className="text text_type_main-default text_color_inactive">
          {error ?? 'Попробуйте еще раз'}
        </p>
      </div>
    );
  }

  if (status === 'loading' || number === null) {
    return (
      <div className={styles.details}>
        <div className="mb-8">
          <Preloader />
        </div>
        <p className="text text_type_main-medium mb-15">Создаём заказ</p>
        <p className="text text_type_main-default text_color_inactive">
          Дождитесь ответа сервера
        </p>
      </div>
    );
  }

  return (
    <div className={styles.details}>
      <p className={`${styles.number} text text_type_digits-large mb-8`}>{number}</p>
      <p className="text text_type_main-medium mb-15">{description}</p>
      <div className={`${styles.iconWrapper} mb-15`}>
        <CheckMarkIcon type="primary" className={styles.icon} />
      </div>
      <p className="text text_type_main-default mb-2">{statusText}</p>
      <p className="text text_type_main-default text_color_inactive">{waitMessage}</p>
    </div>
  );
};
