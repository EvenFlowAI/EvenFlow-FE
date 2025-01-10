import { Slider } from "@mui/material";
import theme from "../../theme/theme";

import { withStyles } from "tss-react/mui";

export const ValueSlider = withStyles(Slider, {
  track: {
    height: 2,
    "&.Mui-disabled": {
      backgroundColor: "#858585",
      borderColor: "#858585",
    },
    backgroundColor: "#7898FF",
    borderColor: "#7898FF",
  },
  root: {
    height: 4,
    "&.Mui-disabled": {
      "& > .MuiSlider-track": {
        backgroundColor: "#858585",
        borderColor: "#858585",
      },
    },
  },
  rail: {
    height: 4,
  },
  marked: {
    marginBottom: 0,
    marginTop: 20,
  },
  mark: {
    height: 4,
    width: 1,
  },
  markLabel: {
    top: -17,
  },
  thumb: {
    width: 0,
    height: 0,
    "&:focus, &:hover, &:active": {
      width: 0,
      height: 0,
      boxShadow: "none",
    },
  },
  valueLabel: {
    top: 15,
    left: -22,
    backgroundColor: "transparent",
    transition: theme.transitions.create(["box-shadow"]),
    "&:focus, &:hover, &:active": {
      boxShadow:
        "1 2px 4px rgba(0,0,0,0.1),0 2px 4px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.02)",
      "@media (hover: none)": {
        boxShadow:
          "0 3px 1px rgba(0,0,0,0.1),0 2px 4px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
      },
    },
    "&>span": {
      background: "#FFFFFF",
      boxShadow: "1px 4px 10px rgba(0, 44, 131, 0.3)",
      borderRadius: 2,
      width: 27,
      height: 22,
      transform: "none",
      textAlign: "center",
      lineHeight: "20px",
      fontSize: 12,
      "&>span": {
        transform: "none",
        color: theme.palette.text.primary,
      },
    },
  },
});
