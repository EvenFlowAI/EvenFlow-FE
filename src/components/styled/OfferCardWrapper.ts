import { styled } from '@mui/material';

export const OfferCardWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 24,
  margin: 16,
  backgroundColor: '#DADADA',
  '& > .buttonsWrapper': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  '& > .image': {
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: 100,
    width: '100%',
  },
}));
