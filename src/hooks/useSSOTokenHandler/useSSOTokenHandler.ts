import { useEffect } from 'react';
import { ITokens } from '../../types/auth';
import { authService } from '../../api/AuthService/AuthService';
import { useException } from '../useException/useException';
import { PARTNER_APP_AUTH_EVENT } from '../../utils/constants';

/**
 * Type guard to validate SSO token message data structure
 * Ensures event.data is an object with expected properties before type casting
 */
const isSSOTokenMessage = (data: unknown): data is { type?: string; tokens?: ITokens } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    'tokens' in data &&
    typeof (data as Record<string, unknown>).type === 'string'
  );
};

/**
 * Hook to handle SSO token messages from parent window via postMessage
 * Listens for token events and syncs authentication
 */
export const useSSOTokenHandler = (setAppIsReady: (ready: boolean) => void) => {
  const showError = useException();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === null || event.origin === 'null') return;

      const data = event.data;
      if (!isSSOTokenMessage(data)) {
        showError('Received invalid SSO token message format');
        return;
      }

      if (data?.type !== PARTNER_APP_AUTH_EVENT) return;

      const tokens = data.tokens;
      if (!tokens) return;

      const sendStatus = (origin: string, status: 'success' | 'error', payload?: unknown) => {
        window.parent?.postMessage({ type: PARTNER_APP_AUTH_EVENT, status, payload }, origin);
      };

      try {
        authService.setTokens(tokens);
        authService.syncRequestAuthWithLocalStorage();
        sendStatus(event.origin, 'success', undefined);
      } catch (e) {
        showError(`Error processing SSO tokens: ${e}`);
        sendStatus(event.origin, 'error', {
          message: (e as Error)?.message ?? 'Unknown error',
        });
      } finally {
        setAppIsReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showError, setAppIsReady]);
};
