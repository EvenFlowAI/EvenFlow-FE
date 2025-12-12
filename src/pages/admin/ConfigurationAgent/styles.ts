import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    width: '100%',
    height: '83vh',
    minWidth: '320px',
    minHeight: '400px',
    marginTop: '24px',
  },
}));
