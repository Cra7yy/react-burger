import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';

describe('Modal', () => {
  it('renders title and children', () => {
    render(
      <Modal title="Детали ингредиента" onClose={vi.fn()}>
        <div>Тестовый контент</div>
      </Modal>
    );

    expect(
      screen.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeInTheDocument();
    expect(screen.getByText('Тестовый контент')).toBeInTheDocument();
  });

  it('closes on close button click', () => {
    const onClose = vi.fn();

    render(
      <Modal title="Детали ингредиента" onClose={onClose}>
        <div>Тестовый контент</div>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();

    render(
      <Modal title="Детали ингредиента" onClose={onClose}>
        <div>Тестовый контент</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('modal-overlay'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    const onClose = vi.fn();

    render(
      <Modal title="Детали ингредиента" onClose={onClose}>
        <div>Тестовый контент</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
