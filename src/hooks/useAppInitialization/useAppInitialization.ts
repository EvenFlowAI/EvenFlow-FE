import { useEffect, useState } from 'react';
import { authService } from '../../api/AuthService/AuthService';
import { useException } from '../useException/useException';
import { useLayout } from '../useLayout/useLayout';

/**
 * Hook to handle app initialization and authentication readiness
 * Checks if user is authenticated and sets app ready state accordingly
 */
export const useAppInitialization = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const showError = useException();
  const isBookingFrame = useLayout();

  useEffect(() => {
    try {
      if (authService.isAuthenticated()) {
        setAppIsReady(true);
      }

      // If in iframe, wait for tokens
      if (window.self !== window.top) {
        // checking is it a booking frame, looking on frame url
        if (isBookingFrame) {
          setAppIsReady(true);
          return;
        }

        // If the client doesn't have a frame parameter in the booking URL, we check ourselves and look if there are 4 characters after /welcome
        const pathname = window.location.pathname;
        const match = /^\/welcome\/([A-Za-z0-9]{4})$/.exec(pathname);
        if (match) {
          setAppIsReady(true);
        }
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
