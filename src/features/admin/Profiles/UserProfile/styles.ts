import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()((theme) => ({
  container: {
    "& input": {
      backgroundColor: "#fff",
    },
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
      marginBottom: theme.spacing(1),
    },
  },
  divider: {
    margin: "30px 0",
  },
  editButtonContainer: {
    textAlign: "right",
    marginTop: 15,
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
      order: 1,
    },
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    display: "block",
  },
  centerButton: {
    minWidth: 80,
  },
}));
