import { makeStyles } from 'tss-react/mui';

export const useLocationStyles = makeStyles()(() => ({
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
      border: '1px solid red',
      '& > div > div': {
        fontSize: '1rem',
        color: '#ff00006b',
        opacity: 1,
      },
    },
  },
}));
