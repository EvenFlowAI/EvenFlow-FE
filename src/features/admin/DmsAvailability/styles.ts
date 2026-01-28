import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: '1px solid rgba(218, 218, 218, 1)',
    padding: '24px',
  },
  queryWrapper: {
    display: 'flex',
  },
  headerText: {
    fontSize: '18px',
    color: 'rgba(37, 39, 51, 1)',
    fontWeight: 700,
    margin: 0,
    textTransform: 'uppercase',
  },
  lineWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  line: {
    border: '1px solid rgba(234, 235, 238, 1)',
    height: '90%',
  },
  query: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  results: {
    display: 'flex',
  },
  select: {
    '& > div': {
      borderRadius: 0,
      backgroundColor: '#F7F8FB',
      padding: 2,
      border: '1px solid #DADADA',
      '& > div > div': {
        fontSize: '1rem',
        color: '#212121',
        backgroundColor: 'transparent',
      },
    },
  },
  emptySelect: {
    '& > div': {
      borderRadius: 0,
      backgroundColor: '#F7F8FB',
      padding: 2,
      border: '1px solid #DADADA',
      '& > div > div': {
        fontSize: '1rem',
      },
    },
  },
  errorSelect: {
    '& > div': {
      borderRadius: 0,
      backgroundColor: '#F7F8FB',
      padding: 2,
      border: '1px solid red !important',
      '& > div > div': {
        fontSize: '1rem',
        // color: '#ff00006b',
        opacity: 1,
      },
    },
  },
});
