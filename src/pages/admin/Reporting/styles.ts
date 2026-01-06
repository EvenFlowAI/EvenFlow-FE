import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    marginTop: '28px',
    width: '100%',
  },
  nav: {
    textAlign: 'left',
    fontSize: '24px',
    margin: '0 0 20px 0',
    display: 'flex',
  },
  reporting: {
    margin: '0',
  },
  navReportName: {
    fontWeight: 'bold',
  },
  navSeparator: {
    margin: '0 8px',
  },
}));
