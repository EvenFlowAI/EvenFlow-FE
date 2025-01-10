import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subTitle: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
    fontSize: 17,
  },
  filtersWrapper: {
    width: "50%",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
  selectedCode: {
    fontWeight: "bold",
    fontSize: 14,
    maxWidth: "40%",
  },
}));

//
export const useInputStyles = makeStyles()(() => ({
  inputRoot: {
    fontWeight: "bold",
  },
}));
