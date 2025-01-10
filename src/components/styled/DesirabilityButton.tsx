import { Button } from "@mui/material";

import { withStyles } from "tss-react/mui";

export const DesirabilityButton = withStyles(Button, (theme) => ({
  root: {
    textTransform: "none",
    fontSize: 12,
    fontWeight: "bold",
    padding: "0 8px",
    minWidth: 60,
    marginRight: 6,
    "&:last-child": {
      marginRight: 0,
    },
  },
  contained: {
    "&:hover": {
      boxShadow: "none",
    },
    "&:not(.MuiButton-containedPrimary)": {
      background: "#fff",
      border: "1px solid #7898FF",
      color: "#7898FF",
    },
    // "&.MuiButton-containedPrimary:hover, &:not(.MuiButton-containedPrimary:hover)": {
    //     boxShadow: "none"
    // }
  },
}));
