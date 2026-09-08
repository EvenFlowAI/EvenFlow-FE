import { useEffect, useState } from 'react';

export const useDebounce = <S extends any = string>(val: S, delay: number = 1000): S => {
  const [state, setState] = useState<S>(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setState(val);
    }, delay);
    return () => clearTimeout(handler);
  }, [val, delay]);

  return state;
};
