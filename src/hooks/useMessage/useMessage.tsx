import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';

type TVariant = 'default' | 'warning' | 'success' | 'error' | 'info';

export function useMessage() {
  const { enqueueSnackbar } = useSnackbar();
  return (message: ReactNode, variant?: TVariant) => {
    enqueueSnackbar(message, { variant: variant || 'success' });
  };
}
