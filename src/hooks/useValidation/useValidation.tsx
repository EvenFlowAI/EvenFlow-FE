import { ValidationKeyPairs } from '../../types/types';
import { useSnackbar } from 'notistack';

export function useValidation<U>(fields: ValidationKeyPairs<U>[], data: U) {
  const { enqueueSnackbar } = useSnackbar();

  return () => {
    const errors: ValidationKeyPairs<U>[] = [];
    for (const field of fields) {
      if (!data[field.field]) {
        enqueueSnackbar(field.message, { variant: 'error' });
        errors.push(field);
      }
    }
    return errors;
  };
}
