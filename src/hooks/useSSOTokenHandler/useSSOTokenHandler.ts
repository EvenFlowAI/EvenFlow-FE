import { useEffect } from 'react';
import { ITokens } from '../../types/auth';
import { authService } from '../../api/AuthService/AuthService';
import { useException } from '../useException/useException';
import { PARTNER_APP_AUTH_EVENT } from '../../utils/constants';

/**
 * Hook to handle SSO token messages from parent window via postMessage
 * Listens for token events and syncs authentication
 */
export const useSSOTokenHandler = (setAppIsReady: (ready: boolean) => void) => {
  const showError = useException();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === null || event.origin === 'null') return;
      const data = event.data as {
        type?: string;
        tokens?: ITokens;
      };
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
