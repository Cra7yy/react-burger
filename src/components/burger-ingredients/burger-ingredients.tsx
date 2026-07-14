import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useMemo } from 'react';

import { BurgerIngredientCard } from '../burger-ingredient-card/burger-ingredient-card'; // твой компонент карточки

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

const TYPE_NAMES: Record<string, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');

  const grouped = useMemo(() => {
    return ingredients.reduce<Record<string, TIngredient[]>>((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});
  }, [ingredients]);

  const tabs = ['bun', 'main', 'sauce'];

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {tabs.map((type) => (
            <Tab
              key={type}
              value={type}
              active={currentTab === type}
              onClick={setCurrentTab}
            >
              {TYPE_NAMES[type]}
            </Tab>
          ))}
        </ul>
      </nav>
      <div className={styles.block_ingredients}>
        {tabs.map((type) => {
          const items = grouped[type] || [];

          return (
            <div key={type} id={type} className={styles.ingredient_section}>
              <p className="text text_type_main-medium mb-6">{TYPE_NAMES[type]}</p>
              <div className={styles.block_cards}>
                {items.map((ingredient) => (
                  <BurgerIngredientCard
                    key={ingredient._id}
                    data={ingredient}
                    onClick={() => onIngredientClick(ingredient)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
