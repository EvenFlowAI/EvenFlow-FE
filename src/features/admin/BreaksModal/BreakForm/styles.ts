import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()({
  button: {
    marginBottom: 3,
  },
  text: {
    textAlign: "center",
    marginBottom: 10,
  },
  container: {
    marginBottom: 12,
    "&:last-child": {
      marginBottom: 0,
    },
  },
});
