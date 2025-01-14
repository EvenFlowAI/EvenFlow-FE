import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  scrollableTable: {
    maxHeight: 300,
    overflowY: 'auto',
    marginBottom: 20,
  },
}));
