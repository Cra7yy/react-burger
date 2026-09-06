import type { Middleware } from '@reduxjs/toolkit';

export type TWsActions = {
  connect: string;
  disconnect: string;
  connected: string;
  message: string;
  error: string;
  closed: string;
};

type TConnectionPayload = {
  url: string;
  [key: string]: unknown;
};

const isAction = (value: unknown): value is { type: string; payload?: unknown } =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  typeof value.type === 'string';

export const socketMiddleware = (wsActions: TWsActions): Middleware => {
  const sockets = new Map<string, WebSocket>();

  return (store) =>
    (next) =>
    (action): unknown => {
      const result = next(action);
      if (!isAction(action)) return result;

      if (action.type === wsActions.connect) {
        const payload = action.payload;
        if (
          typeof payload !== 'object' ||
          payload === null ||
          !('url' in payload) ||
          typeof payload.url !== 'string'
        ) {
          return result;
        }

        const connection = payload as TConnectionPayload;
        sockets.get(connection.url)?.close();
        const socket = new WebSocket(connection.url);
        sockets.set(connection.url, socket);
        socket.onopen = (): void => {
          if (sockets.get(connection.url) !== socket) return;
          store.dispatch({ type: wsActions.connected, payload: connection });
        };
        socket.onmessage = (event): void => {
          if (sockets.get(connection.url) !== socket) return;
          try {
            store.dispatch({
              type: wsActions.message,
              payload: JSON.parse(event.data as string) as unknown,
              meta: connection,
            });
          } catch {
            store.dispatch({
              type: wsActions.error,
              payload: 'Не удалось прочитать данные сокета',
              meta: connection,
            });
          }
        };
        socket.onerror = (): void => {
          if (sockets.get(connection.url) !== socket) return;
          store.dispatch({
            type: wsActions.error,
            payload: 'Не удалось подключиться к сокету',
            meta: connection,
          });
        };
        socket.onclose = (): void => {
          if (sockets.get(connection.url) !== socket) return;
          sockets.delete(connection.url);
          store.dispatch({ type: wsActions.closed, payload: connection });
        };
      }

      if (action.type === wsActions.disconnect) {
        const payload = action.payload;
        if (typeof payload !== 'object' || payload === null || !('url' in payload)) {
          return result;
        }
        const url = payload.url;
        if (typeof url !== 'string') return result;
        sockets.get(url)?.close();
        sockets.delete(url);
      }

      return result;
    };
};
