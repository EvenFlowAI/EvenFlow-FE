import { ReactNode } from 'react';

/** Visual mode of the banner */
export type TBannerVariant = 'error' | 'notification';

export interface IErrorBannerItem {
  id: string;
  message: ReactNode;
  variant: TBannerVariant;
}

export interface IErrorBannerProps {
  message: ReactNode;
  /** Called after the hiding animation is finished */
  onClose: () => void;
  variant?: TBannerVariant;
  className?: string;
  /** Pass 0 to disable auto hiding */
  autoHideDuration?: number;
}

export interface IErrorBannersProps {
  banners: IErrorBannerItem[];
  onClose: (id: string) => void;
  className?: string;
  autoHideDuration?: number;
}
