import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '0 25px',
    marginBottom: '20px',
  },
}));
