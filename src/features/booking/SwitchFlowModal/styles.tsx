import { styled } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const TextWrapper = styled('div')({
  fontSize: 20,
  marginBottom: 16,
  marginTop: 32,
});

export const InputsWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

export const Label = styled('div')({
  fontWeight: 700,
  margin: '0 0 4px 0',
  textTransform: 'uppercase',
  fontSize: 12,
});

export const useStyles = makeStyles()(() => ({
  label: {
    whiteSpace: 'nowrap',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
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
