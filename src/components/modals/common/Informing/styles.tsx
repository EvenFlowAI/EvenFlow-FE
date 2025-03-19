import { styled } from '@mui/material';

export const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& > div:first-child': {
    marginRight: 16,
  },
});
