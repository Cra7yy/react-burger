import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useAppSelector } from '@services/hooks';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsStatus,
} from '@services/selectors';

import type { JSX } from 'react';

type TIngredientPageProps = {
  isModal?: boolean;
};

export const IngredientPage = ({
  isModal = false,
}: TIngredientPageProps): JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector(selectIngredients);
  const status = useAppSelector(selectIngredientsStatus);
  const error = useAppSelector(selectIngredientsError);

  const ingredient = ingredients.find((item) => item._id === id);

  if (status === 'loading') {
    return (
      <div className="centered-content">
        <Preloader />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="details-page">
        <p className="text text_type_main-medium">
          {error ?? 'Не удалось загрузить данные ингредиента'}
        </p>
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="details-page">
        <p className="text text_type_main-medium">Ингредиент не найден</p>
      </div>
    );
  }

  return (
    <section className="details-page">
      {!isModal && (
        <h1 className="text text_type_main-large mt-10 mb-5">Детали ингредиента</h1>
      )}
      <IngredientDetails ingredient={ingredient} />
    </section>
  );
};
