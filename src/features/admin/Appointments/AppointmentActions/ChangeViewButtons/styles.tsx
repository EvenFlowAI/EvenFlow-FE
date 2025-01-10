import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  leftButton: {
    borderRadius: '4px 0px 0px 4px',
    border: '1px solid #7898FF',
    padding: '7px 11px',
  },
  rightButton: {
    borderRadius: '0px 4px 4px 0px',
    border: '1px solid #7898FF',
    padding: '7px 11px',
  },
}));
