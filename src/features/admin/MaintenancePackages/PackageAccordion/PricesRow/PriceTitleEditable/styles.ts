import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#252525",
    color: "#FFFFFF",
    fontWeight: 16,
    padding: "21px 16px",
  },
  textInput: {
    background: "black",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    overflow: "hidden",
    textOverflow: "ellipsis",

    "& > input": {
      padding: 8,
      fontSize: 16,
    },
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
  editIcon: {
    padding: 0,
  },
}));
