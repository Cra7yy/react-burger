import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  data: TIngredient;
  onClick: () => void;
};

export const BurgerIngredientCard = ({
  data,
  onClick,
}: TBurgerIngredientCardProps): JSX.Element => {
  const { name, price, image } = data;

  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <img src={image} alt={name} />
      <div className={styles.block_price}>
        <p className="text text_type_digits-default">{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{name}</p>
    </button>
  );
};
