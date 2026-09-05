import { Price } from '@components/price/price';

import type { TIngredientUI } from '@utils/types';
import type { JSX } from 'react';

import styles from './content-card.module.css';

type TProps = {
  ingredient: TIngredientUI;
  amount: number;
};

export const ContentCard = ({ ingredient, amount }: TProps): JSX.Element => {
  const { image_mobile, name, price } = ingredient;
  return (
    <div className={`${styles.content} mb-4`}>
      <div className="mobile-ingredient-image mr-4">
        <img src={image_mobile} alt="ingredient-image" />
      </div>
      <div className={`${styles.name} text text_type_main-default mr-4`}>{name}</div>
      <div className={`${styles.price} text text_type_digits-default`}>
        {amount}&nbsp;x&nbsp;
        <Price
          typographyClass="text text_type_digits-default"
          price={price}
          iconSize="small"
        />
      </div>
    </div>
  );
};
