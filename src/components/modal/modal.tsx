import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { JSX, PropsWithChildren } from 'react';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
};

export const Modal = ({
  title,
  onClose,
  children,
}: PropsWithChildren<TModalProps>): JSX.Element => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const modalRoot = document.getElementById('modals') ?? document.body;

  return createPortal(
    <div className={styles.modal}>
      <ModalOverlay onClick={onClose} />
      <div
        className={styles.content}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Модальное окно'}
      >
        <div className={styles.header}>
          {title ? (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          ) : (
            <div className={styles.headerSpacer} />
          )}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
