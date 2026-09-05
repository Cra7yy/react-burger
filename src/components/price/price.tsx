import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';

import type { JSX } from 'react';

import styles from './price.module.css';

type TProps = {
  price: number;
  typographyClass: string;
  iconSize: 'small' | 'large';
};

export const Price = ({ price, typographyClass, iconSize }: TProps): JSX.Element => {
  return (
    <div className={styles.price_container}>
      <p className={`${typographyClass} mr-2 text`}>{price}</p>
      <CurrencyIcon
        type="primary"
        className={clsx({ [styles.price_icon_large]: iconSize === 'large' })}
      />
    </div>
  );
};
