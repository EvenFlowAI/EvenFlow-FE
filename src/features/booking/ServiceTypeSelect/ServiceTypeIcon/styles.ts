import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  icon: {
    width: "100%",
    maxHeight: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 112,
    [`${theme.breakpoints.down("mdl")} and (orientation: portrait)`]: {
      maxWidth: 147,
      maxHeight: 77,
      minHeight: 77,
    },
    [`${theme.breakpoints.down("md")} and (orientation: landscape)`]: {
      maxWidth: 224,
      maxHeight: 112,
    },
  },
  noLogo: {
    width: "100%",
    minHeight: 105,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#DCDCDC",
    fontWeight: "bold",
    fontSize: 32,
    padding: "10%",
    backgroundColor: "#F4F4F4",
    [`${theme.breakpoints.down("md")} and (orientation: portrait)`]: {
      padding: "7%",
      minHeight: 80,
    },
    [`${theme.breakpoints.down("mdl")} and (orientation: portrait)`]: {
      padding: "7%",
      height: 80,
      minHeight: 80,
      width: 152,
    },
    [`${theme.breakpoints.down("md")} and (orientation: landscape)`]: {
      width: 224,
      padding: "7%",
      height: 112,
    },
  },
  image: {
    maxWidth: "100%",
    maxHeight: 112,
    [theme.breakpoints.down("mdl")]: {
      maxWidth: 147,
      maxHeight: 77,
    },
  },
}));
