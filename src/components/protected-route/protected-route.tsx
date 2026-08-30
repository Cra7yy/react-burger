import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { selectAuthUser, selectIsAuthChecked } from '@services/selectors';

import type { JSX, PropsWithChildren } from 'react';

type TProtectedRouteProps = PropsWithChildren<{
  onlyUnAuth?: boolean;
}>;

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): JSX.Element => {
  const user = useAppSelector(selectAuthUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();
  const locationState = location.state as TLocationState | null;
  const fromPath = locationState?.from?.pathname ?? '/';

  if (!isAuthChecked) {
    return (
      <div className="centered-content">
        <Preloader />
      </div>
    );
  }

  if (onlyUnAuth && user) {
    return <Navigate to={fromPath} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
