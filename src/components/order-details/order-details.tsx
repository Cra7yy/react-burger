import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import { ORDER_DETAILS_MOCK } from '@utils/constants';

import type { JSX } from 'react';

import styles from './order-details.module.css';

type TOrderDetailsProps = Record<string, never>;

export const OrderDetails = (_props: TOrderDetailsProps): JSX.Element => {
  const { number, description, status, waitMessage } = ORDER_DETAILS_MOCK;

  return (
    <div className={styles.details}>
      <p className={`${styles.number} text text_type_digits-large mb-8`}>{number}</p>
      <p className="text text_type_main-medium mb-15">{description}</p>
      <div className={`${styles.iconWrapper} mb-15`}>
        <CheckMarkIcon type="primary" className={styles.icon} />
      </div>
      <p className="text text_type_main-default mb-2">{status}</p>
      <p className="text text_type_main-default text_color_inactive">{waitMessage}</p>
    </div>
  );
};
