import { FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';

import { ContentCard } from '@components/content-card/content-card';
import { Price } from '@components/price/price';
import { INGREDIENTS, ORDER_STATUS_TEXT } from '@utils/constants';

import type { TIngredientUI, TOrderCardUI } from '@utils/types';
import type { JSX } from 'react';

import styles from './order.module.css';

type TProps = {
  order: TOrderCardUI;
};

export const Order = ({ order }: TProps): JSX.Element => {
  const { name, status, date, price, ingredients } = order;

  const content = new Map<string, { ingredient: TIngredientUI; amount: number }>([]);

  ingredients.forEach((el) => {
    const target = content.get(el._id);
    if (target) {
      content.set(el._id, {
        ingredient: el,
        amount: el.type !== INGREDIENTS.BUN ? target.amount + 1 : target.amount,
      });
    } else {
      content.set(el._id, {
        ingredient: el,
        amount: el.type === INGREDIENTS.BUN ? 2 : 1,
      });
    }
  });

  return (
    <div className="mt-10">
      <div className="text text_type_main-medium mb-3">{name}</div>
      <div
        className={`${clsx({ [styles.status_done]: status === 'done' })} text text_type_main-default mb-15`}
      >
        {ORDER_STATUS_TEXT[status]}
      </div>
      <div className="text text_type_main-medium mb-6">Состав:</div>
      <div className={`${styles.content} mb-10 pr-6`}>
        {Array.from(content.entries()).map(([key, item]) => {
          return (
            <ContentCard key={key} ingredient={item.ingredient} amount={item.amount} />
          );
        })}
      </div>
      <div className={styles.footer}>
        <FormattedDate
          date={new Date(date)}
          className="text text_type_main-default text_color_inactive"
        />
        <Price
          typographyClass="text text_type_digits-default"
          price={price}
          iconSize="small"
        />
      </div>
    </div>
  );
};
