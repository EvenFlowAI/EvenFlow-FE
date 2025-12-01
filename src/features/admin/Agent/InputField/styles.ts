import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  iconProfile: {
    marginRight: 8,
  },
  stopElement: {
    cursor: 'pointer',
    color: 'rgba(120, 152, 255, 1)',
    fontWeight: 'bold',
  },
}));
