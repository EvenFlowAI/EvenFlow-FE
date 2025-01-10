import { makeStyles } from "tss-react/mui";

export const useLoadingStyles = makeStyles()((theme) => ({
  wrapper: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));
