import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    width: '70%',
    '& > iframe': {
      width: '100%',
      height: 548,
    },
    '& > div': {
      fontSize: 10,
    },
  },
}));
