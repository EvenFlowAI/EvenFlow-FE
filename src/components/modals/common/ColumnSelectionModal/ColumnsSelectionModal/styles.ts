import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()({
  wrapper: {
    height: 240,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: '0px 8px',
  },
  label: {
    maxWidth: '50%',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
  },
});
