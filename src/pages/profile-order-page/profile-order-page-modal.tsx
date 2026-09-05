import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { Order } from '@components/order/order';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  clearSelectedOrder,
  fetchOrderById,
  selectOrdersState,
  selectSelectedOrder,
  selectSelectedOrderError,
  selectSelectedOrderStatus,
  toOrderCard,
} from '@services/orders-slice';
import { selectIngredients } from '@services/selectors';

import type { JSX } from 'react';

export const ModalOrder = (): JSX.Element => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const kind = location.pathname.startsWith('/profile/orders') ? 'profile' : 'feed';
  const data = useAppSelector((state) => selectOrdersState(state, kind));
  const selected = useAppSelector(selectSelectedOrder);
  const selectedStatus = useAppSelector(selectSelectedOrderStatus);
  const error = useAppSelector(selectSelectedOrderError);
  const listedOrder = id ? data.orders.find((order) => order._id === id) : undefined;
  const sourceOrder = selected?._id === id ? selected : listedOrder;
  const order = sourceOrder ? toOrderCard(sourceOrder, ingredients) : null;
  const isModal = Boolean(
    (location.state as { backgroundLocation?: unknown } | null)?.backgroundLocation
  );
  const backUrl = kind === 'profile' ? '/profile/orders' : '/feed';

  useEffect(() => {
    dispatch(clearSelectedOrder());
    if (!listedOrder && id) void dispatch(fetchOrderById(id));
    return (): void => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id, listedOrder]);

  const content = order ? (
    <Order order={order} />
  ) : selectedStatus === 'failed' ? (
    <div className="text text_type_main-medium">{error}</div>
  ) : (
    <Preloader />
  );
  const handleClose = (): void => {
    void navigate(backUrl);
  };

  if (!isModal) {
    return (
      <main className="details-page">
        <div className="order-details">{content}</div>
      </main>
    );
  }

  return (
    <Modal
      title={order ? `#${order.number}` : ''}
      titleTypography="text_type_digits-medium"
      onClose={handleClose}
    >
      {content}
    </Modal>
  );
};
