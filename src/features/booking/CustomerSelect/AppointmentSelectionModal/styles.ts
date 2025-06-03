import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  header: {
    marginBottom: 12
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontSize: '24px',
    color: '#202021'
  },
  wrapper: {
    width: '100%',
    margin: '3px auto 8px',
    display: 'grid',
    gridTemplateColumns: '48% 48%',
    justifyContent: 'space-between',
    gap: 24,

    '@media (max-width: 768px)': {
      gridTemplateColumns: '100%',
      width: '100%',
    },
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    margin: '0 0 12px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F7F8FB',
    borderRadius: '50%',
    border: '1px solid #DADADA',
  },
  dateAndTimeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 16,
    color: '#202021',
    fontWeight: 600,
  },
  wrapperItem: {
    width: '302px',
    height: '124px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 12,
    background: '#F7F8FB',
    fontSize: 16,
    fontFamily: 'Proxima Nova',
    color: '#202021',
    border: '1px solid #DADADA',
    margin: '0 auto',
    padding: 0,
    cursor: 'pointer',
    '&:hover': {
      background: '#DADADA'
    },

    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  footer: {
    display: 'flex',
    alignSelf: 'flex-end',
    marginRight: 10,

    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
}));
