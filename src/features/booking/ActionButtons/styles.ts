import { styled } from '@mui/material';

export const ButtonsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '22px',
  marginTop: 20,
  '& button': {
    minWidth: 144,
  },
  [theme.breakpoints.down('mdl')]: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: 100,
    flexDirection: 'row',
    width: '100%',
    gap: '12px',
    backgroundColor: '#F7F8FB',
    marginTop: 0,
    padding: '10px 20px',
    '& button': {
      width: '100%',
    },
  },
}));
