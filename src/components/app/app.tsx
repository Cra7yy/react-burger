import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients-slice';
import { closeOrderModal } from '@services/order-slice';
import { clearSelectedIngredient } from '@services/selected-ingredient-slice';
import {
  selectIngredientsError,
  selectIngredientsStatus,
  selectOrderModalOpen,
  selectSelectedIngredient,
} from '@services/selectors';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredientsStatus = useAppSelector(selectIngredientsStatus);
  const ingredientsError = useAppSelector(selectIngredientsError);
  const selectedIngredient = useAppSelector(selectSelectedIngredient);
  const isOrderModalOpen = useAppSelector(selectOrderModalOpen);
  const handleCloseIngredientModal = useCallback(() => {
    dispatch(clearSelectedIngredient());
  }, [dispatch]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        {ingredientsStatus === 'loading' ? (
          <div className={styles.loader}>
            <Preloader />
          </div>
        ) : ingredientsStatus === 'failed' ? (
          <p className={`${styles.error} text text_type_main-medium`}>
            {ingredientsError ?? 'Не удалось загрузить ингредиенты'}
          </p>
        ) : (
          <>
            <BurgerIngredients />
            <BurgerConstructor />
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
