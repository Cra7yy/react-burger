import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { API_DOMAIN } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

const INGREDIENTS_URL = `${API_DOMAIN}/api/ingredients`;

const isIngredientsResponse = (value: unknown): value is TIngredientsResponse => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const response = value as { success?: unknown; data?: unknown };

  return response.success === true && Array.isArray(response.data);
};

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadIngredients = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(INGREDIENTS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Не удалось загрузить ингредиенты: ${response.status}`);
        }

        const payload: unknown = await response.json();

        if (!isIngredientsResponse(payload)) {
          throw new Error('Некорректный ответ сервера');
        }

        setIngredients(payload.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setError(
          error instanceof Error ? error.message : 'Не удалось загрузить ингредиенты'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadIngredients();

    return (): void => controller.abort();
  }, []);

  const bun = ingredients.find((ingredient) => ingredient.type === 'bun') ?? null;
  const constructorIngredients = ingredients.filter(
    (ingredient) => ingredient.type !== 'bun'
  );
  const totalPrice = useMemo(() => {
    const ingredientsPrice = constructorIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return ingredientsPrice + (bun ? bun.price * 2 : 0);
  }, [bun, constructorIngredients]);

  const handleIngredientClick = (ingredient: TIngredient): void => {
    setSelectedIngredient(ingredient);
  };

  const handleOrderClick = (): void => {
    setIsOrderModalOpen(true);
  };

  const handleCloseIngredientModal = (): void => {
    setSelectedIngredient(null);
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        {isLoading ? (
          <div className={styles.loader}>
            <Preloader />
          </div>
        ) : error ? (
          <p className={`${styles.error} text text_type_main-medium`}>{error}</p>
        ) : (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={handleIngredientClick}
            />
            <BurgerConstructor
              bun={bun}
              ingredients={constructorIngredients}
              totalPrice={totalPrice}
              onSendOrder={handleOrderClick}
            />
          </>
        )}
      </main>
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
