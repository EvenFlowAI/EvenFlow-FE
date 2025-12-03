import { useEffect, useState } from 'react';
import { authService } from '../../api/AuthService/AuthService';
import { useException } from '../useException/useException';

/**
 * Hook to handle app initialization and authentication readiness
 * Checks if user is authenticated and sets app ready state accordingly
 */
export const useAppInitialization = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const showError = useException();

  useEffect(() => {
    try {
      if (authService.isAuthenticated()) {
        setAppIsReady(true);
      }

      // If in iframe, wait for tokens
      if (window.self !== window.top) {
        return;
      }

      // Not embedded and not authenticated
      setAppIsReady(true);
    } catch (error) {
      showError(`Failed to initialize app: ${error}`);
      setAppIsReady(true); // Still render to show error
    }
  }, [showError]);

  return { appIsReady, setAppIsReady };
};
