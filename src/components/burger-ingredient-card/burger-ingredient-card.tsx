import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { useAppDispatch } from '@services/hooks';
import { selectIngredient } from '@services/selected-ingredient-slice';

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
  const dispatch = useAppDispatch();
  const { name, price, image } = data;
  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPE,
    item: { ingredient: data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const setRef = (node: HTMLButtonElement | null): void => {
    drag(node);
  };

  const handleClick = (): void => {
    dispatch(selectIngredient(data));
  };

  return (
    <button
      ref={setRef}
      type="button"
      className={styles.card}
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {count > 0 && <Counter count={count} size="default" extraClass={styles.counter} />}
      <img src={image} alt={name} />
      <div className={styles.block_price}>
        <p className="text text_type_digits-default">{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{name}</p>
    </button>
  );
};
