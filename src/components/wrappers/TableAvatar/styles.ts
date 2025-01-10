import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    fontSize: 12,
    width: 30,
    height: 30,
  },
}));
