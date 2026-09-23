import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useStyles } from './styles';
import { BANNER_AUTO_HIDE_DURATION, BANNER_TRANSITION_DURATION } from './constants';
import { IErrorBannerProps } from './types';

export const ErrorBanner: React.FC<IErrorBannerProps> = ({
  message,
  onClose,
  className,
  variant = 'error',
  autoHideDuration = BANNER_AUTO_HIDE_DURATION,
}) => {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => setIsVisible(false), []);

  // smooth appearance right after mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!autoHideDuration) return;

    timer.current = setTimeout(hide, autoHideDuration);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [autoHideDuration, hide]);

  const handleClose = () => {
    if (timer.current) clearTimeout(timer.current);
    hide();
  };

  return (
    <Collapse
      in={isVisible}
      appear
      timeout={BANNER_TRANSITION_DURATION}
      unmountOnExit
      onExited={onClose}
    >
      <div className={cx(classes.banner, classes[variant], className)} role="alert">
        <p className={classes.message}>{message}</p>
        <IconButton
          className={classes.closeButton}
          onClick={handleClose}
          size="small"
          aria-label={t('Close')}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Collapse>
  );
};
