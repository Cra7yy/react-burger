import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed-page/feed-page';
import { FeedModalOrders } from '@pages/feed-page/feed-page-modal-orders';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { HomePage } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page';
import { LoginPage } from '@pages/login-page/login-page';
import { NotFoundPage } from '@pages/not-found-page/not-found-page';
import { ProfileFormPage } from '@pages/profile-form-page/profile-form-page';
import { ProfileOrderPage } from '@pages/profile-order-page/profile-order-page';
import { ModalOrder as ProfileOrderModal } from '@pages/profile-order-page/profile-order-page-modal';
import { ProfilePage } from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';
import { checkUserAuth } from '@services/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients-slice';
import { createOrder, closeOrderModal } from '@services/order-slice';
import { selectAuthUser, selectOrderModalOpen } from '@services/selectors';
import {
  INGREDIENT_MODAL_BACKGROUND_KEY,
  INGREDIENT_MODAL_OPEN_KEY,
  PENDING_ORDER_KEY,
} from '@utils/constants';

import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: Location;
};

const getStoredBackgroundLocation = (location: Location): Location | null => {
  if (!location.pathname.startsWith('/ingredients/')) {
    return null;
  }

  const isModalOpen = localStorage.getItem(INGREDIENT_MODAL_OPEN_KEY) === 'true';
  const backgroundPath = localStorage.getItem(INGREDIENT_MODAL_BACKGROUND_KEY);

  if (!isModalOpen || !backgroundPath) {
    return null;
  }

  return {
    ...location,
    pathname: backgroundPath,
    search: '',
    hash: '',
    state: null,
  };
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isOrderModalOpen = useAppSelector(selectOrderModalOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as TLocationState | null;
  const restoredBackgroundLocation = getStoredBackgroundLocation(location);
  const backgroundLocation =
    locationState?.backgroundLocation ?? restoredBackgroundLocation;
  const displayLocation = backgroundLocation ?? location;
  const isIngredientModalOpen =
    location.pathname.startsWith('/ingredients/') && Boolean(backgroundLocation);

  const handleCloseOrderModal = useCallback((): void => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  const handleCloseIngredientModal = useCallback((): void => {
    const backgroundPath = localStorage.getItem(INGREDIENT_MODAL_BACKGROUND_KEY) ?? '/';
    localStorage.removeItem(INGREDIENT_MODAL_BACKGROUND_KEY);
    localStorage.removeItem(INGREDIENT_MODAL_OPEN_KEY);
    void navigate(backgroundPath, { replace: true });
  }, [navigate]);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!user || sessionStorage.getItem(PENDING_ORDER_KEY) !== 'true') {
      return;
    }

    sessionStorage.removeItem(PENDING_ORDER_KEY);
    void dispatch(createOrder());
  }, [dispatch, user]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={displayLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed" element={<FeedPage />}></Route>
        <Route path="/feed/:id" element={<FeedModalOrders />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileFormPage />} />
          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>
        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <ProfileOrderModal />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {isIngredientModalOpen && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
                <IngredientPage isModal />
              </Modal>
            }
          />
        </Routes>
      )}
      {backgroundLocation && (
        <Routes>
          <Route path="/feed/:id" element={<FeedModalOrders />} />
          <Route path="/profile/orders/:id" element={<ProfileOrderModal />} />
        </Routes>
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
