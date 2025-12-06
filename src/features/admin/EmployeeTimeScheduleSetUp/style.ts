import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  timePickersWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  boldText: {
    fontWeight: 'bold',
  },
}));
