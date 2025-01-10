import { styled } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const SelectWrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const useStyles = makeStyles()(() => ({
  vinWrapper: {
    '& > label': {
      textTransform: 'none',
      fontSize: 14,
      color: '#142EA1',
      fontWeight: 'normal',
      textOverflow: 'unset',
    },
  },
  label: {
    whiteSpace: 'nowrap',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transformOrigin: 'top left',
    transform: 'translate(0, -1.5px) scale(0.75)',
  },
  select: {
    width: '100%',
    borderRadius: 0,
    '&:before': {
      display: 'none',
    },
    '& > div': {
      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
}));
