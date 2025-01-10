import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()({
  wrapper: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "1fr 3fr 4fr 1fr 1fr",
    alignItems: "baseline",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
});
