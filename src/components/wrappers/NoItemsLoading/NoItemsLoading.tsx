import React from 'react';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

type TProps = {
  loading?: boolean;
  label?: string;
  items: number;
  wrapperStyles?: React.CSSProperties;
};

const divStyles = { textAlign: 'center' as const, width: '100%' };

export const NoItemsLoading: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  loading,
  items,
  label,
  wrapperStyles,
}) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div style={{ ...divStyles, ...(wrapperStyles ?? {}) }}>
        <CircularProgress />
      </div>
    );
  } else if (!items) {
    return (
      <div style={{ ...divStyles, ...(wrapperStyles ?? {}) }}>
        {label ? label : `${t('No items')}.`}
      </div>
    );
  } else {
    return null;
  }
};
