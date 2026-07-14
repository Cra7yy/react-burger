import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): JSX.Element => {
  const { image_large, name, calories, proteins, fat, carbohydrates } = ingredient;

  return (
    <div className={styles.details}>
      <img className={styles.image} src={image_large} alt={name} />
      <h3 className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>{name}</h3>
      <ul className={styles.nutritionList}>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {calories}
          </span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {proteins}
          </span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {fat}
          </span>
        </li>
        <li className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {carbohydrates}
          </span>
        </li>
      </ul>
    </div>
  );
};
