import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()({
  wrapper: {
    maxHeight: 100,
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gap: 25,
    overflowY: 'auto',
    border: '1px solid #DADADA',
    borderRadius: 2,
    padding: '19px 24px',
    marginTop: 32,
    backgroundColor: '#F7F8FB',
  },
  zone: {
    fontWeight: 'bold',
  },
  emptyWrapper: {
    height: '100%',
  },
});
