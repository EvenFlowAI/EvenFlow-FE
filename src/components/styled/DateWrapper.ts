import { styled } from '@mui/material';

export const DateWrapper = styled('div')(({ theme }) => ({
  marginBottom: 'auto',
  textAlign: 'right',
  fontSize: 16,
  fontWeight: 'bold',
  [theme.breakpoints.down('mdl')]: {
    marginTop: 12,
    textAlign: 'left',
    fontWeight: 'normal',
  },
}));
