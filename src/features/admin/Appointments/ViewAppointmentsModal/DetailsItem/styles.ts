import { makeStyles } from "tss-react/mui";

export const useDetailsItemStyles = makeStyles()({
  wrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  icon: {
    marginRight: 32,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#252733",
    fontSize: 14,
  },
  text: {
    display: "flex",
    flexDirection: "column",
    color: "#858585",
    fontSize: 14,
  },
});
