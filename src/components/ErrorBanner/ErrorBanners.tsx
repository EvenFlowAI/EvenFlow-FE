import React from 'react';
import { ErrorBanner } from './ErrorBanner';
import { useStyles } from './styles';
import { IErrorBannersProps } from './types';

/**
 * Inline list of error banners. Render it wherever the errors should appear,
 * for example right above a table.
 */
export const ErrorBanners: React.FC<IErrorBannersProps> = ({
  banners,
  onClose,
  className,
  autoHideDuration,
}) => {
  const { classes, cx } = useStyles();

  if (!banners.length) return null;

  return (
    <div className={cx(classes.list, className)}>
      {banners.map(banner => (
        <ErrorBanner
          key={banner.id}
          message={banner.message}
          variant={banner.variant}
          autoHideDuration={autoHideDuration}
          onClose={() => onClose(banner.id)}
        />
      ))}
    </div>
  );
};
