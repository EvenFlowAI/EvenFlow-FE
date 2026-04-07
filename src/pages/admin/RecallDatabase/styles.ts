import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()({
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableWrapper: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'end',
    position: 'relative',
    top: 4,
  },
  filtersWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});
