import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  header: {
    marginBottom: 12
  },
  wrapper: {
    width: '50%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '46% 46%',
    justifyContent: 'space-between',
    gap: 24,

    '@media (max-width: 768px)': {
      gridTemplateColumns: '100%',
      width: '90%',
    },
  },

  wrapperItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 6,
    gap: 10,
    padding: '4px 0px',
    background: '#36454f',
    fontSize: 16,
    color: 'white',
    border: 'none',
    cursor: 'pointer',

    '@media (max-width: 768px)': {
      width: '60%',
      margin: '0 auto'
    },
  },
  footer: {
    display: 'flex',
    alignSelf: 'flex-end',
    marginRight: 10
  }
}));
