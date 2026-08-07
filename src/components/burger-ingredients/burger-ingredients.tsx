import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAppSelector } from '@services/hooks';
import { selectIngredientCounts, selectIngredients } from '@services/selectors';

import { BurgerIngredientCard } from '../burger-ingredient-card/burger-ingredient-card';

import type { TIngredient, TIngredientType } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

const TYPE_NAMES: Record<TIngredientType, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

const TABS: TIngredientType[] = ['bun', 'main', 'sauce'];

export const BurgerIngredients = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');
  const ingredients = useAppSelector(selectIngredients);
  const ingredientCounts = useAppSelector(selectIngredientCounts);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<
    Partial<Record<TIngredientType, HTMLHeadingElement | null>>
  >({});

  const grouped = useMemo(() => {
    const initialGroups: Record<TIngredientType, TIngredient[]> = {
      bun: [],
      main: [],
      sauce: [],
    };

    return ingredients.reduce<Record<TIngredientType, TIngredient[]>>((acc, item) => {
      acc[item.type].push(item);
      return acc;
    }, initialGroups);
  }, [ingredients]);

  const updateActiveTab = useCallback((): void => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const closestTab = TABS.reduce<{ tab: TIngredientType; distance: number } | null>(
      (closest, tab) => {
        const heading = sectionRefs.current[tab];

        if (!heading) {
          return closest;
        }

        const distance = Math.abs(
          heading.getBoundingClientRect().top - containerRect.top
        );

        if (!closest || distance < closest.distance) {
          return { tab, distance };
        }

        return closest;
      },
      null
    );

    if (closestTab) {
      setCurrentTab(closestTab.tab);
    }
  }, []);

  useEffect(() => {
    updateActiveTab();
  }, [grouped, updateActiveTab]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = (): void => {
      updateActiveTab();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return (): void => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [grouped, updateActiveTab]);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {TABS.map((type) => (
            <Tab
              key={type}
              value={type}
              active={currentTab === type}
              onClick={(value) => {
                setCurrentTab(value as TIngredientType);
              }}
            >
              {TYPE_NAMES[type]}
            </Tab>
          ))}
        </ul>
      </nav>
      <div ref={containerRef} className={`${styles.block_ingredients} custom-scroll`}>
        {TABS.map((type) => {
          const items = grouped[type] || [];

          return (
            <div key={type} id={type} className={styles.ingredient_section}>
              <h2
                ref={(node) => {
                  sectionRefs.current[type] = node;
                }}
                className="text text_type_main-medium mb-6"
              >
                {TYPE_NAMES[type]}
              </h2>
              <div className={styles.block_cards}>
                {items.map((ingredient) => (
                  <BurgerIngredientCard
                    key={ingredient._id}
                    data={ingredient}
                    count={ingredientCounts[ingredient._id] ?? 0}
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
