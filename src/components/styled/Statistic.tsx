import { styled } from '@mui/material';

export const Statistic = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  alignSelf: 'center',
  '& .label': {
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#5E5F66',
  },
  '& .value': {
    fontSize: 16,
  },
});
