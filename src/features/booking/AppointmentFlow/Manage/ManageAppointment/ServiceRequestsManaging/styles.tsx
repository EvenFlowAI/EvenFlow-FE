import { styled } from '@mui/material';

export const TitleWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '8px 0',
});

export const List = styled('ul')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  gap: '12px',
  margin: '12px 0 0',
  padding: 0,
  listStyle: 'none',
  '& .service-item': {
    textTransform: 'capitalize',
  },
});

export const ServiceItem = styled('li')({
  textTransform: 'capitalize',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

export const MessageIconWrapper = styled('div')({
  '&:hover': {
    cursor: 'pointer',
  },
});