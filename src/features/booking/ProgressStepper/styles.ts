import { styled } from '@mui/material';

export const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

export const Label = styled('span')(() => ({
  height: 55,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  fontWeight: 'bold',
}));
