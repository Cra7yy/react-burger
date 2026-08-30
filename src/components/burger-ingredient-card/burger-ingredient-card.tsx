import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import {
  INGREDIENT_MODAL_BACKGROUND_KEY,
  INGREDIENT_MODAL_OPEN_KEY,
} from '@utils/constants';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredient-card.module.css';

const DND_TYPE = 'catalog-ingredient';

type TBurgerIngredientCardProps = {
  data: TIngredient;
  count: number;
};

export const BurgerIngredientCard = ({
  data,
  count,
}: TBurgerIngredientCardProps): JSX.Element => {
  const location = useLocation();
  const { name, price, image } = data;
  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPE,
    item: { ingredient: data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const setRef = (node: HTMLAnchorElement | null): void => {
    drag(node);
  };

  const handleClick = (): void => {
    localStorage.setItem(INGREDIENT_MODAL_OPEN_KEY, 'true');
    localStorage.setItem(INGREDIENT_MODAL_BACKGROUND_KEY, location.pathname);
  };

  return (
    <Link
      ref={setRef}
      to={`/ingredients/${data._id}`}
      className={styles.card}
      state={{ backgroundLocation: location }}
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      aria-label={name}
    >
      {count > 0 && <Counter count={count} size="default" extraClass={styles.counter} />}
      <img src={image} alt={name} />
      <div className={styles.block_price}>
        <p className="text text_type_digits-default">{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{name}</p>
    </Link>
  );
};
