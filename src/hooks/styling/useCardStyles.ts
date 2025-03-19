import { makeStyles } from 'tss-react/mui';

export const useCardStyles = makeStyles()(() => ({
  paper: {
    height: '100%',
    borderRadius: 0,
    padding: 20,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    margin: 0,
  },
  value: {
    marginTop: 20,
    fontSize: 48,
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineHeight: '48px',
  },
  helperText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    marginTop: 24,
  },
  label: {
    fontWeight: 400,
    fontSize: 19,
    marginTop: 4,
    color: '#252733',
  },
  edit: {
    position: 'absolute',
    top: 10,
    right: 6,
    fontSize: 16,
  },
}));
