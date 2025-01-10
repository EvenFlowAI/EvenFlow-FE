import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'start',
    background: '#7898FF',
    color: 'white',
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 14,
    margin: 4,
    padding: 4,
  },
  icon: {
    marginLeft: 5,
    fontSize: 16,
    background: 'white',
    color: '#7898FF',
    borderRadius: '50%',
    cursor: 'pointer',
  },
}));
