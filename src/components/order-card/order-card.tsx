import { FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';

import { Price } from '@components/price/price';
import { ORDER_STATUS_TEXT } from '@utils/constants';

import type { TOrderCardUI } from '@utils/types';
import type { JSX, MouseEvent } from 'react';

import styles from './order-card.module.css';

type TProps = {
  data: TOrderCardUI;
  onClick: (value: TOrderCardUI) => void;
};

export const OrderCard = ({ data, onClick }: TProps): JSX.Element => {
  const { ingredients, name, price, date, status, number } = data;

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    onClick(data);
  };

  return (
    <div onClick={handleClick} className={styles.container}>
      <div className={`${styles.content} mb-6`}>
        <div className={`text text_type_digits-default`}>#{number}</div>
        <div className={`text text_type_main-default text_color_inactive`}>
          <FormattedDate date={new Date(date)} />
        </div>
      </div>
      <div className={`text text_type_main-medium mb-2`}>{name}</div>
      {status && (
        <div
          className={`${clsx({ [styles.status_done]: status === 'done' })} text text_type_main-default mb-2`}
        >
          {ORDER_STATUS_TEXT[status]}
        </div>
      )}
      <div className={`${styles.content} mt-4`}>
        <div className={`${styles.images}`}>
          {ingredients.map((el, index) => {
            if (index <= 5) {
              return (
                <div
                  className={`${styles.ingredient} mobile-ingredient-image`}
                  style={{
                    zIndex:
                      ingredients.length -
                      index +
                      (ingredients.length > 6 && index === 5 ? 10 : 0),
                  }}
                  key={index}
                >
                  {ingredients.length > 6 && index === 5 && (
                    <span className="text text_type_main-default">
                      +{ingredients.length - 6}
                    </span>
                  )}
                  <img src={el.image_mobile} alt="ingredient-image" />
                </div>
              );
            }
            return null;
          })}
        </div>
        <Price
          typographyClass="text text_type_digits-default"
          price={price}
          iconSize="small"
        />
      </div>
    </div>
  );
};
