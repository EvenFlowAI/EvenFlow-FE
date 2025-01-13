import { styled } from '@mui/material';

export const Wrapper = styled('div')(() => ({
  fontSize: 16,
  fontWeight: 'bold',
  '& .uppercase': {
    textTransform: 'uppercase',
  },
}));

export const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  textTransform: 'uppercase',
}));

export const FiltersWrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  alignItems: 'center',
  gap: 16,
  marginTop: 8,
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: 8,
  },
}));
