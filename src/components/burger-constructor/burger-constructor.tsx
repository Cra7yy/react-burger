import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import {
  addIngredient,
  moveIngredient,
  removeIngredient,
} from '@services/constructor-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { createOrder } from '@services/order-slice';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
  selectOrderStatus,
} from '@services/selectors';

import type { TConstructorIngredient, TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

const DND_TYPES = {
  CATALOG_INGREDIENT: 'catalog-ingredient',
  CONSTRUCTOR_INGREDIENT: 'constructor-ingredient',
} as const;

type TCatalogIngredientItem = {
  ingredient: TIngredient;
};

type TConstructorIngredientItem = {
  uid: string;
  index: number;
};

const ConstructorIngredientRow = ({
  ingredient,
  index,
  onRemove,
  onMove,
}: {
  ingredient: TConstructorIngredient;
  index: number;
  onRemove: (uid: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, drag] = useDrag<
    TConstructorIngredientItem,
    void,
    { isDragging: boolean }
  >({
    type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
    item: { uid: ingredient.uid, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<TConstructorIngredientItem>({
    accept: DND_TYPES.CONSTRUCTOR_INGREDIENT,
    hover: (dragItem) => {
      if (!ref.current || dragItem.index === index) {
        return;
      }

      onMove(dragItem.index, index);
      dragItem.index = index;
    },
  });

  const setRef = (node: HTMLDivElement | null): void => {
    ref.current = node;
    if (node) {
      drag(drop(node));
    }
  };

  return (
    <div
      ref={setRef}
      className={`${styles.burger_constructor_item} mb-4 mr-1`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.ingredient_drag_icon}>
        <DragIcon type="primary" />
      </div>
      <div className={`${styles.burger_constructor_ingredient} ml-2`}>
        <ConstructorElement
          handleClose={() => onRemove(ingredient.uid)}
          price={ingredient.price}
          text={ingredient.name}
          thumbnail={ingredient.image_mobile}
        />
      </div>
    </div>
  );
};

export const BurgerConstructor = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);
  const orderStatus = useAppSelector(selectOrderStatus);
  const topBunRef = useRef<HTMLDivElement | null>(null);
  const bottomBunRef = useRef<HTMLDivElement | null>(null);
  const ingredientsRef = useRef<HTMLDivElement | null>(null);

  const [, topBunDrop] = useDrop<TCatalogIngredientItem>({
    accept: DND_TYPES.CATALOG_INGREDIENT,
    drop: (item) => {
      if (item.ingredient.type === 'bun') {
        dispatch(addIngredient(item.ingredient));
      }
    },
  });

  const [, bottomBunDrop] = useDrop<TCatalogIngredientItem>({
    accept: DND_TYPES.CATALOG_INGREDIENT,
    drop: (item) => {
      if (item.ingredient.type === 'bun') {
        dispatch(addIngredient(item.ingredient));
      }
    },
  });

  const [, ingredientsDrop] = useDrop<TCatalogIngredientItem>({
    accept: DND_TYPES.CATALOG_INGREDIENT,
    drop: (item) => {
      if (item.ingredient.type !== 'bun') {
        dispatch(addIngredient(item.ingredient));
      }
    },
  });

  const setTopBunRef = (node: HTMLDivElement | null): void => {
    topBunRef.current = node;
    if (node) {
      topBunDrop(node);
    }
  };

  const setBottomBunRef = (node: HTMLDivElement | null): void => {
    bottomBunRef.current = node;
    if (node) {
      bottomBunDrop(node);
    }
  };

  const setIngredientsRef = (node: HTMLDivElement | null): void => {
    ingredientsRef.current = node;
    if (node) {
      ingredientsDrop(node);
    }
  };

  const handleSendOrder = (): void => {
    void dispatch(createOrder());
  };

  const handleRemove = (uid: string): void => {
    dispatch(removeIngredient(uid));
  };

  const handleMove = (fromIndex: number, toIndex: number): void => {
    dispatch(moveIngredient({ fromIndex, toIndex }));
  };

  return (
    <section className={`${styles.burger_constructor} mb-10 pt-5 pr-4 pb-10 pl-4`}>
      <div className={styles.burger_constructor_hover}>
        <div
          ref={setTopBunRef}
          className={`${styles.burger_constructor_item} mb-4 mr-1`}
        >
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

        <div
          ref={setIngredientsRef}
          className={`${styles.burger_constructor_list} custom-scroll`}
        >
          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <ConstructorIngredientRow
                key={item.uid}
                ingredient={item}
                index={index}
                onRemove={handleRemove}
                onMove={handleMove}
              />
            ))
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

        <div
          ref={setBottomBunRef}
          className={`${styles.burger_constructor_item} mb-4 mr-1`}
        >
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
          disabled={orderStatus === 'loading' || bun === null}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
