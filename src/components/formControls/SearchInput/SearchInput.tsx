import React, { useEffect, useRef } from 'react';
import { TextField } from '../TextFieldStyled/TextField';
import { Search } from '@mui/icons-material';
import { TSearchInputProps } from '../../../types/types';
import { useDebounce } from '../../../hooks/useDebounce/useDebounce';

export const SearchInput: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TSearchInputProps>>
> = ({ placeholder, onSearch, value, delay = 1000, ...props }) => {
  const isInit = useRef(true);
  const debouncedSearch = useDebounce(value, delay);
  useEffect(() => {
    if (!isInit.current && onSearch) {
      onSearch();
    }
  }, [debouncedSearch, onSearch]);
  useEffect(() => {
    isInit.current = false;
  }, []);

  return (
    <TextField
      placeholder={placeholder ?? 'Search...'}
      endAdornment={<Search />}
      value={value}
      {...props}
    />
  );
};
