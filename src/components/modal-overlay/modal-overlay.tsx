import type { JSX } from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick: () => void;
};

export const ModalOverlay = ({ onClick }: TModalOverlayProps): JSX.Element => {
  return (
    <div
      className={styles.overlay}
      onClick={onClick}
      aria-hidden="true"
      data-testid="modal-overlay"
    />
  );
};
