import { styled } from '@mui/material';

export const CodesWrapper = styled('div')({
  display: 'flex',
  alignItems: 'start',
  alignContent: 'start',
  flexWrap: 'wrap',
});

export const Title = styled('span')({
  width: 147,
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

export const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  gridColumn: '2 / -1',
});
