import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
}));
