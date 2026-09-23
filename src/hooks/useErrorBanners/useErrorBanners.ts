import { ReactNode, useCallback, useState } from 'react';
import { IErrorBannerItem, MAX_BANNERS_COUNT, TBannerVariant } from '../../components/ErrorBanner';

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type TUseErrorBanners = {
  banners: IErrorBannerItem[];
  /** Adds a banner with the given mode (`error` by default) */
  showBanner: (message: ReactNode, variant?: TBannerVariant) => void;
  showError: (message: ReactNode) => void;
  showNotification: (message: ReactNode) => void;
  hideError: (id: string) => void;
  clearErrors: () => void;
};

/**
 * Keeps the list of banners rendered by the `ErrorBanners` component.
 * Not more than `MAX_BANNERS_COUNT` banners are kept, the oldest one is dropped.
 */
export function useErrorBanners(maxCount: number = MAX_BANNERS_COUNT): TUseErrorBanners {
  const [banners, setBanners] = useState<IErrorBannerItem[]>([]);

  const showBanner = useCallback(
    (message: ReactNode, variant: TBannerVariant = 'error') => {
      setBanners(prev => [...prev, { id: generateId(), message, variant }].slice(-maxCount));
    },
    [maxCount]
  );

  const showError = useCallback((message: ReactNode) => showBanner(message, 'error'), [showBanner]);

  const showNotification = useCallback(
    (message: ReactNode) => showBanner(message, 'notification'),
    [showBanner]
  );

  const hideError = useCallback((id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  }, []);

  const clearErrors = useCallback(() => setBanners([]), []);

  return { banners, showBanner, showError, showNotification, hideError, clearErrors };
}
