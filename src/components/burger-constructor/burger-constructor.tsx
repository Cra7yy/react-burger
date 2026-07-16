import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  bun?: TIngredient | null;
  totalPrice?: number;
  onSendOrder?: () => void;
  onRemoveIngredient?: (id: string) => void;
};

export const BurgerConstructor = ({
  ingredients = [],
  bun,
  totalPrice = 0,
  onSendOrder,
  onRemoveIngredient,
}: TBurgerConstructorProps): JSX.Element => {
  const handleSendOrder = (): void => {
    onSendOrder?.();
  };

  const handleRemove = (id: string): void => {
    onRemoveIngredient?.(id);
  };

  return (
    <section className={`${styles.burger_constructor} mb-10 pt-5 pr-4 pb-10 pl-4`}>
      <div className={styles.burger_constructor_hover}>
        <div className={`${styles.burger_constructor_item} mb-4 mr-1`}>
          <div className={`${styles.burger_constructor_ingredient} ml-2`}>
            {bun ? (
              <ConstructorElement
                handleClose={() => null}
                isLocked
                price={bun.price}
                text={`${bun.name} (верх)`}
                thumbnail={bun.image_mobile}
                type="top"
              />
            ) : (
              <div
                className={`${styles.placeholder_container} text text_type_main-default`}
              >
                Выберите булки
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.burger_constructor_list} custom-scroll`}>
          {ingredients.length > 0 ? (
            ingredients.map((item) => {
              const key = item._id;
              return (
                <div key={key} className={`${styles.burger_constructor_item} mb-4 mr-1`}>
                  <div className={styles.ingredient_drag_icon}>
                    <DragIcon type="primary" />
                  </div>
                  <div className={`${styles.burger_constructor_ingredient} ml-2`}>
                    <ConstructorElement
                      handleClose={() => handleRemove(item._id)}
                      price={item.price}
                      text={item.name}
                      thumbnail={item.image_mobile}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${styles.burger_constructor_item} mb-4 mr-1`}>
              <div className={`${styles.burger_constructor_ingredient} ml-2`}>
                <div
                  className={`${styles.placeholder_container} text text_type_main-default`}
                >
                  Выберите начинку
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${styles.burger_constructor_item} mb-4 mr-1`}>
          <div className={`${styles.burger_constructor_ingredient} ml-2`}>
            {bun ? (
              <ConstructorElement
                handleClose={() => null}
                isLocked
                price={bun.price}
                text={`${bun.name} (низ)`}
                thumbnail={bun.image_mobile}
                type="bottom"
              />
            ) : (
              <div
                className={`${styles.placeholder_container} text text_type_main-default`}
              >
                Выберите булки
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.burger_constructor_footer} mb-3`}>
        <div className={styles.price_container}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" className={styles.price_icon_large} />
        </div>
        <Button
          onClick={handleSendOrder}
          size="large"
          type="primary"
          htmlType="button"
          extraClass="ml-10"
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
