import { Link } from 'react-router-dom';

import type { JSX } from 'react';

export const NotFoundPage = (): JSX.Element => (
  <section className="not-found-page">
    <h1 className="text text_type_digits-large mb-6">404</h1>
    <p className="text text_type_main-medium mb-10">Страница не найдена</p>
    <Link to="/" className="text-link-button text text_type_main-default">
      Перейти в конструктор
    </Link>
  </section>
);
