import { styled } from '@mui/material';

export const Wrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 20,
}));

export const PriceValue = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  '.previousPrice': {
    textDecoration: 'line-through',
  },
  '.discount': {
    fontWeight: 700,
    color: '#008331',
  },
}));

const ExpDate = styled('div')(() => ({
  fontWeight: 700,
  color: '#008331',
}));
