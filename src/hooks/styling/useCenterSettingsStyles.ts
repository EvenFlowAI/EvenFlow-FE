import { makeStyles } from 'tss-react/mui';

export const useCenterSettingsStyles = makeStyles()({
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
    fontSize: 24,
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  helperText: {
    fontSize: 14,
    lineHeight: '17px',
    marginTop: 24,
    paddingBottom: 24,
    color: '#252733',
  },
  label: {
    fontWeight: 300,
    fontSize: 19,
    marginTop: 14,
    color: '#252733',
  },
  edit: {
    position: 'absolute',
    top: 10,
    right: 6,
    fontSize: 16,
  },
});
