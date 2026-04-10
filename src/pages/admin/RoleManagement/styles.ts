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
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  text: {
    margin: 0,
    fontSize: '16px',
  },
  filtersWrapper: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  filter: {
    width: 180,
  },
});
