import { makeStyles } from 'tss-react/mui';

//
export const useOfferInputStyles = makeStyles()(() => ({
  input: {
    '& > label': {
      color: '#FFFFFF',
    },
    '& > input': {
      backgroundColor: '#FFFFFF',
    },
  },
}));
