import { Tabs as Ts } from "@mui/material";
import { withStyles } from "tss-react/mui";
import { TabPanel as Tp } from "@mui/lab";

export const Tabs = withStyles(Ts, {
  root: {
    padding: 0,
    borderBottom: `none`,
    "& .MuiTab-root": {
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    "& .MuiTabs-indicator": {
      height: 0,
    },
    "& .MuiButtonBase-root": {
      padding: 4,
    },
    "& .MuiSvgIcon-root": {
      verticalAlign: "middle",
    },
  },
  indicator: {
    backgroundColor: "transparent",
  },
});

export const TabPanel = withStyles(Tp, {
  root: {
    padding: 0,
  },
});
