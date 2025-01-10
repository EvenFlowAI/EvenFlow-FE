import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    width: '70%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
}));
